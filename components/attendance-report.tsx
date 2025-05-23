"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Student {
  _id: string
  name: string
  rollNumber: string
  class: string
}

interface AttendanceRecord {
  _id: string
  date: string
  class: string
  students: {
    studentId: string
    present: boolean
  }[]
}

export default function AttendanceReport() {
  const [date, setDate] = useState("")
  const [className, setClassName] = useState("all") // Updated default value to 'all'
  const [classes, setClasses] = useState<string[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  useEffect(() => {
    if (date || className !== "all") {
      // Updated condition to check if className is not 'all'
      fetchAttendance()
    }
  }, [date, className])

  // Replace the fetchStudents function with this implementation
  const fetchStudents = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get students from localStorage
      const studentsJSON = localStorage.getItem("students")
      const storedStudents = studentsJSON ? JSON.parse(studentsJSON) : []

      setStudents(storedStudents)
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching students")
    } finally {
      setLoading(false)
    }
  }

  // Replace the fetchClasses function with this implementation
  const fetchClasses = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get students from localStorage
      const studentsJSON = localStorage.getItem("students")
      const storedStudents = studentsJSON ? JSON.parse(studentsJSON) : []

      // Extract unique classes
      const uniqueClasses = Array.from(new Set(storedStudents.map((student: Student) => student.class)))
      setClasses(uniqueClasses as string[])
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching classes")
    }
  }

  // Replace the fetchAttendance function with this implementation
  const fetchAttendance = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get attendance records from localStorage
      const attendanceJSON = localStorage.getItem("attendance")
      const allRecords = attendanceJSON ? JSON.parse(attendanceJSON) : []

      // Filter records based on date and class
      let filteredRecords = [...allRecords]

      if (date) {
        filteredRecords = filteredRecords.filter((record) => record.date === date)
      }

      if (className !== "all") {
        filteredRecords = filteredRecords.filter((record) => record.class === className)
      }

      setAttendanceRecords(filteredRecords)
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching attendance records")
    }
  }

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s._id === studentId)
    return student ? student.name : "Unknown Student"
  }

  const getStudentRollNumber = (studentId: string) => {
    const student = students.find((s) => s._id === studentId)
    return student ? student.rollNumber : "N/A"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF report
    alert("Export functionality would be implemented here")
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={className} onValueChange={setClassName}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem> {/* Updated value prop to 'all' */}
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" className="w-full" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {attendanceRecords.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.flatMap((record) =>
                  record.students.map((student) => (
                    <TableRow key={`${record._id}-${student.studentId}`}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>{getStudentRollNumber(student.studentId)}</TableCell>
                      <TableCell>{getStudentName(student.studentId)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            student.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.present ? "Present" : "Absent"}
                        </span>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No attendance records found. Please select a date or class to view records.
        </div>
      )}
    </div>
  )
}
