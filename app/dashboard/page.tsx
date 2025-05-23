"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudentList from "@/components/student-list"
import AttendanceForm from "@/components/attendance-form"
import AttendanceReport from "@/components/attendance-report"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("students")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // In a real app, we would check if the user is logged in
  useEffect(() => {
    // Check login status from localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setIsLoggedIn(true)
    } else {
      // Redirect to login if not logged in
      window.location.href = "/"
    }
  }, [])

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("currentUser")
    // Redirect to login
    window.location.href = "/"
  }

  if (!isLoggedIn) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Classroom Attendance Monitor</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage students and track attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="attendance">Take Attendance</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="students">
                <StudentList />
              </TabsContent>
              <TabsContent value="attendance">
                <AttendanceForm />
              </TabsContent>
              <TabsContent value="reports">
                <AttendanceReport />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
