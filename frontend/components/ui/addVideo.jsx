import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import instance from "@/lib/axios-instance";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  Home,
  LogOut,
  Clock,
  User,
  Film,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AddContent() {
  const [userData, setUserData] = useState({
    userName: "",
    secondsRemaining: 0,
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await instance.get("/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData({
          userName: response.data.userName,
          secondsRemaining: response.data.secondsRemaining,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        router.push("/login");
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({
        type: "error",
        content: "Please upload a video or audio file.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await instance.post("/upload/addvideo", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({ type: "success", content: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        content: error.response?.data?.error || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Vlogify
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-1">
                <Clock className="h-4 w-4 text-indigo-500 mr-2" />
                <span className="text-sm font-medium">
                  {formatTime(userData.secondsRemaining)} credits
                </span>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">{userData.userName}</span>
              </div>

              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Home className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create Your Blog Post
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Transform your videos or audio recordings into engaging blog posts
              in just a few clicks
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <CardTitle className="text-2xl font-bold text-center">
                Upload Media
              </CardTitle>
              <CardDescription className="text-indigo-100 text-center">
                Upload your video or audio file to generate a professional blog
                post
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="video/*,audio/*"
                    ref={fileInputRef}
                    className="hidden"
                    id="file-upload"
                  />

                  {!file ? (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex flex-col items-center justify-center"
                    >
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                        <Upload className="h-8 w-8 text-indigo-500" />
                      </div>
                      <h3 className="font-medium text-lg text-gray-700 dark:text-gray-200 mb-1">
                        Upload your media file
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                        Drag & drop your file here or click to browse
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                        Max file size: 30MB • Max duration: 10 minutes
                      </p>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mr-4">
                          <Film className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span>Processing your content...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Generate Blog Post</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4">
              <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Average processing time: 2-3 minutes</span>
              </div>
            </CardFooter>
          </Card>

          {message.content && (
            <Alert
              className={`mt-6 transition-all duration-300 ease-in-out shadow-md ${
                message.type === "error"
                  ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
              }`}
            >
              <div className="flex items-center">
                {message.type === "error" ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                )}
                <AlertTitle
                  className={
                    message.type === "error"
                      ? "text-red-700 dark:text-red-300"
                      : "text-green-700 dark:text-green-300"
                  }
                >
                  {message.type === "error" ? "Error" : "Success"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2 text-sm">
                {message.content}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-10 py-6">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© 2025 Vlogify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
