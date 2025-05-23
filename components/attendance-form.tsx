"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Student {
  _id: string
  name: string
  rollNumber: string
  class: string
}

interface AttendanceStudent {
  studentId: string
  present: boolean
}

export default function AttendanceForm() {
  const [date, setDate] = useState("")
  const [className, setClassName] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceStudent[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    // Set today's date as default
    const today = new Date()
    setDate(today.toISOString().split("T")[0])
  }, [])

  useEffect(() => {
    // Filter students by selected class
    if (className) {
      const filtered = students.filter((student) => student.class === className)
      setFilteredStudents(filtered)

      // Initialize attendance array
      const initialAttendance = filtered.map((student) => ({
        studentId: student._id,
        present: false,
      }))
      setAttendance(initialAttendance)
    } else {
      setFilteredStudents([])
      setAttendance([])
    }
  }, [className, students])

  const fetchStudents = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get students from localStorage
      const studentsJSON = localStorage.getItem("students")
      const storedStudents = studentsJSON ? JSON.parse(studentsJSON) : []

      setStudents(storedStudents)

      // Extract unique classes
      const uniqueClasses = Array.from(new Set(storedStudents.map((student: Student) => student.class)))
      setClasses(uniqueClasses as string[])
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching students")
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance((prev) => prev.map((item) => (item.studentId === studentId ? { ...item, present } : item)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!date || !className || attendance.length === 0) {
      setError("Please select date, class, and mark attendance")
      return
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create new attendance record
      const newAttendanceRecord = {
        _id: Date.now().toString(),
        date,
        class: className,
        students: attendance,
      }

      // Get existing attendance records from localStorage
      const attendanceJSON = localStorage.getItem("attendance")
      const attendanceRecords = attendanceJSON ? JSON.parse(attendanceJSON) : []

      // Add new record
      attendanceRecords.push(newAttendanceRecord)

      // Save back to localStorage
      localStorage.setItem("attendance", JSON.stringify(attendanceRecords))

      setSuccess("Attendance saved successfully!")

      // Reset form
      setAttendance(attendance.map((item) => ({ ...item, present: false })))
    } catch (err: any) {
      setError(err.message || "An error occurred while saving attendance")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {className && filteredStudents.length > 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Student Attendance</h3>
                  <div className="text-sm text-gray-500">{filteredStudents.length} students</div>
                </div>

                <div className="space-y-2">
                  {filteredStudents.map((student) => {
                    const attendanceRecord = attendance.find((a) => a.studentId === student._id)
                    return (
                      <div key={student._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                        <Checkbox
                          id={`student-${student._id}`}
                          checked={attendanceRecord?.present || false}
                          onCheckedChange={(checked) => handleAttendanceChange(student._id, checked === true)}
                        />
                        <Label htmlFor={`student-${student._id}`} className="flex-1 cursor-pointer">
                          {student.name} ({student.rollNumber})
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : className ? (
          <div className="text-center py-8 text-gray-500">No students found in this class.</div>
        ) : (
          <div className="text-center py-8 text-gray-500">Please select a class to mark attendance.</div>
        )}

        {className && filteredStudents.length > 0 && (
          <Button type="submit" className="w-full">
            Save Attendance
          </Button>
        )}
      </form>
    </div>
  )
}
