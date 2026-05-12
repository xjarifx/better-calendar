"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCalendar } from "@/lib/calendar-context";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Settings,
  Clock,
  Key,
  Bot,
  User,
  Lock,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function updateTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export default function SettingsPage() {
  const { isAuthenticated, isLoading, hasApiKey, refreshAuth, logout } =
    useAuth();
  const { setFirstDayOfWeek: setContextFirstDayOfWeek } = useCalendar();
  const router = useRouter();

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [timeFormat, setTimeFormat] = useState("12h");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    api.getUserProfile()
      .then((data) => {
        if (data.hasApiKey) {
          setApiKey("••••••••••••••••••••••••••••••");
        }
        if (data.timeFormat) setTimeFormat(data.timeFormat);
        if (data.firstDayOfWeek !== undefined)
          setFirstDayOfWeek(data.firstDayOfWeek);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
    api.getFreeModels()
      .then((data) => {
        if (Array.isArray(data)) setModels(data);
        const saved = localStorage.getItem("preferred-model");
        if (saved) setSelectedModel(saved);
        else if (data && data[0]) setSelectedModel(data[0]);
      })
      .catch(() => {});
  }, [isAuthenticated, isLoading, router]);

  const handleSaveApiKey = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      if (apiKey === "••••••••••••••••••••••••••••••") {
        setError("API key already saved");
        setSaving(false);
        return;
      }
      await api.updateApiKey(apiKey || null);
      setSuccess("API key saved successfully!");
      setApiKey("••••••••••••••••••••••••••••••");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.updateApiKey(null);
      setApiKey("");
      setSuccess("API key removed. Using default key.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove API key");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.updateProfile({ timeFormat, firstDayOfWeek });
      setContextFirstDayOfWeek(firstDayOfWeek);
      setSuccess("Preferences saved!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save preferences",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleModelChange = (m: string) => {
    setSelectedModel(m);
    try {
      localStorage.setItem("preferred-model", m);
    } catch {}
    setSuccess("Model selected");
    setTimeout(() => setSuccess(""), 1500);
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await fetch("/api/auth/delete", { method: "DELETE" });
      if (res.ok) {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {}
        router.push("/login");
      } else {
        const text = await res.text();
        setError("Account deletion failed: " + (text || res.statusText));
      }
    } catch {
      setError("Account deletion failed");
    }
  };

  const handleChangeUsername = async () => {
    setError("");
    setSuccess("");
    setUsernameSaving(true);
    try {
      if (!newUsername.trim()) throw new Error("Username cannot be empty");
      if (!usernamePassword) throw new Error("Current password required");
      await api.updateUsername(newUsername.trim(), usernamePassword);
      setSuccess("Username updated!");
      setNewUsername("");
      setUsernamePassword("");
      refreshAuth();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update username",
      );
    } finally {
      setUsernameSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    setPasswordSaving(true);
    try {
      if (!oldPassword) throw new Error("Current password required");
      if (!newPassword) throw new Error("New password required");
      if (newPassword !== confirmPassword)
        throw new Error("Passwords do not match");
      if (newPassword.length < 6)
        throw new Error("Password must be at least 6 characters");
      const result = await api.updatePassword(oldPassword, newPassword);
      if (result.token) {
        updateTokenCookie(result.token);
      }
      setSuccess(
        "Password updated! You may need to log in again on other devices.",
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border p-6 space-y-4">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-64 bg-muted rounded animate-pulse" />
              <div className="h-9 w-full bg-muted rounded animate-pulse" />
              <div className="h-9 w-28 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-4 md:px-6 md:py-5 space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/calendar")}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Calendar
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle>Preferences</CardTitle>
            </div>
            <CardDescription>
              Configure how your calendar displays time and weeks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Time Format</Label>
              <div className="flex rounded-lg border border-border overflow-hidden w-fit">
                <button
                  type="button"
                  onClick={() => setTimeFormat("12h")}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    timeFormat === "12h"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  12-hour
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat("24h")}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    timeFormat === "24h"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  24-hour
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstDay">First Day of Week</Label>
              <select
                id="firstDay"
                value={firstDayOfWeek}
                onChange={(e) => setFirstDayOfWeek(Number(e.target.value))}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </CardFooter>
        </Card>

        {/* AI Model */}
        {models.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <CardTitle>AI Model</CardTitle>
              </div>
              <CardDescription>
                Choose the AI model used for event extraction from natural
                language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <select
                id="model"
                value={selectedModel || ""}
                onChange={(e) => handleModelChange(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* API Key */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <CardTitle>OpenRouter API Key</CardTitle>
            </div>
            <CardDescription>
              By default, the app uses a shared API key. Adding your own avoids
              rate limits. Get your key at{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                openrouter.ai/keys
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={hasApiKey ? "default" : "secondary"}
                className={hasApiKey ? "" : ""}
              >
                {hasApiKey ? "Personal key" : "Shared key"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {hasApiKey
                  ? "Using your personal API key"
                  : "Using default shared key"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 border-t">
            <Button
              onClick={handleSaveApiKey}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save API Key"}
            </Button>
            {hasApiKey && (
              <Button
                variant="outline"
                onClick={handleRemoveApiKey}
                disabled={saving}
              >
                Remove Key
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Account - Username & Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>
              Update your username or change your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Username */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Change Username
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usernamePassword">Current Password</Label>
                  <Input
                    id="usernamePassword"
                    type="password"
                    value={usernamePassword}
                    onChange={(e) => setUsernamePassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <Button
                  onClick={handleChangeUsername}
                  disabled={usernameSaving}
                >
                  {usernameSaving ? "Saving..." : "Update Username"}
                </Button>
              </div>
            </div>

            <hr className="border-border" />

            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Change Password
              </h3>
              <p className="text-sm text-muted-foreground">
                Changing your password will log you out from other devices.
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={passwordSaving}
                >
                  {passwordSaving ? "Saving..." : "Update Password"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible account actions. Proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently delete your account and all data. This cannot be
                  undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 p-4">
              <div>
                <p className="text-sm font-medium">Logout</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  End your current session. You can log back in anytime.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  try {
                    logout();
                  } catch {}
                }}
                className="shrink-0"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
