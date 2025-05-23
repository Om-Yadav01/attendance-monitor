"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus } from "lucide-react"

interface Student {
  _id: string
  name: string
  rollNumber: string
  class: string
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [className, setClassName] = useState("")

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get students from localStorage or use empty array if none exist
      const studentsJSON = localStorage.getItem("students")
      const storedStudents = studentsJSON ? JSON.parse(studentsJSON) : []

      setStudents(storedStudents)
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching students")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Create new student with unique ID
      const newStudent = {
        _id: Date.now().toString(), // Simple ID generation
        name,
        rollNumber,
        class: className,
      }

      // Get existing students from localStorage
      const studentsJSON = localStorage.getItem("students")
      const storedStudents = studentsJSON ? JSON.parse(studentsJSON) : []

      // Add new student
      storedStudents.push(newStudent)

      // Save back to localStorage
      localStorage.setItem("students", JSON.stringify(storedStudents))

      // Update state
      setStudents([...students, newStudent])

      // Reset form and close dialog
      setName("")
      setRollNumber("")
      setClassName("")
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "An error occurred while adding student")
    }
  }

  if (loading) {
    return <div>Loading students...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Student List</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input id="class" value={className} onChange={(e) => setClassName(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full">
                Add Student
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No students found. Add your first student to get started.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Class</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
