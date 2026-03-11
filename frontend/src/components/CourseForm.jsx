import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function CourseForm({ initialData = null, onSubmit, loading }) {
  const defaultData = {
    code: "",
    name: "",
    department: "",
    credits: 3,
    semester: 1,
    year: new Date().getFullYear(),
    description: "",
    prerequisites: [],
    type: "lecture",
    hoursPerWeek: 3,
  }

  const [formData, setFormData] = useState(defaultData)
  const [prerequisiteInput, setPrerequisiteInput] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        name: initialData.name || "",
        department: initialData.department || "",
        credits: initialData.credits ?? 3,
        semester: initialData.semester ?? 1,
        year: initialData.year ?? new Date().getFullYear(),
        description: initialData.description || "",
        prerequisites: initialData.prerequisites || [],
        type: initialData.type || "lecture",
        hoursPerWeek: initialData.hoursPerWeek ?? 3,
      })
    } else {
      setFormData(defaultData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "credits" || name === "semester" || name === "year" || name === "hoursPerWeek"
          ? Number(value)
          : value,
    }))
  }

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }))
      setPrerequisiteInput("")
    }
  }

  const removePrerequisite = (prerequisite) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prerequisite),
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addPrerequisite()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const inputStyle =
    "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

  return (
    <div className="relative">
      <div className="relative bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Code *</label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CS101"
                required
                className={inputStyle}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department *</label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                required
                className={inputStyle}
              />
            </div>

          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name *</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Introduction to Programming"
              required
              className={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Credits *</label>
              <Input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className={inputStyle}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Semester *</label>
              <Input
                type="number"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                min="1"
                max="8"
                required
                className={inputStyle}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Year *</label>
              <Input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2020"
                max="2030"
                required
                className={inputStyle}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hours / Week *</label>
              <Input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                min="1"
                max="40"
                required
                className={inputStyle}
              />
            </div>

          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="tutorial">Seminar</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter course description..."
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Prerequisites</label>

            <div className="flex gap-3">
              <Input
                type="text"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter prerequisite course code"
                className={inputStyle}
              />

              <Button
                type="button"
                variant="outline"
                onClick={addPrerequisite}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Add
              </Button>
            </div>

            {formData.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <Badge
                    key={index}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-300"
                  >
                    {prerequisite}
                    <button type="button" onClick={() => removePrerequisite(prerequisite)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
            >
              {loading ? "Saving..." : initialData ? "Update Course" : "Add Course"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}