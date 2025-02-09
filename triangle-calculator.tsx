"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TriangleValues {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  height: number
  area: number
  perimeter: number
}

export default function TriangleCalculator() {
  const [values, setValues] = useState<Partial<TriangleValues>>({})
  const [angleUnit, setAngleUnit] = useState("degree")
  const [trianglePoints, setTrianglePoints] = useState({ x: 0, y: 0 })

  const toRadians = (angle: number) => (angleUnit === "degree" ? (angle * Math.PI) / 180 : angle)
  const toDegrees = (angle: number) => (angleUnit === "degree" ? angle : (angle * 180) / Math.PI)

  const calculateTriangle = () => {
    const newValues = { ...values }

    // ensure a + b = 90
    if (newValues.a && newValues.b && newValues.a + newValues.b !== 90) {
      newValues.b = 90 - newValues.a;
    }

    // Calculate missing sides using Pythagorean theorem
    if (newValues.a && newValues.b && !newValues.c) {
      newValues.c = Math.sqrt(Math.pow(newValues.a, 2) + Math.pow(newValues.b, 2))
    } else if (newValues.a && newValues.c && !newValues.b) {
      newValues.b = Math.sqrt(Math.pow(newValues.c, 2) - Math.pow(newValues.a, 2))
    } else if (newValues.b && newValues.c && !newValues.a) {
      newValues.a = Math.sqrt(Math.pow(newValues.c, 2) - Math.pow(newValues.b, 2))
    } else if (newValues.b && !newValues.a && !newValues.c) {
      // If only b is provided, assume it's the hypotenuse (c) of a 45-45-90 triangle
      newValues.c = newValues.b
      newValues.a = newValues.b / Math.sqrt(2)
      newValues.b = newValues.a
    }

    // Calculate angles using inverse trigonometric functions
    if (newValues.a && newValues.c && !newValues.alpha) {
      newValues.alpha = toDegrees(Math.asin(newValues.a / newValues.c))
    } else if (newValues.b && newValues.c && !newValues.alpha) {
      newValues.alpha = toDegrees(Math.acos(newValues.b / newValues.c))
    }

    if (newValues.a && newValues.c && !newValues.beta) {
      newValues.beta = toDegrees(Math.acos(newValues.a / newValues.c))
    } else if (newValues.b && newValues.c && !newValues.beta) {
      newValues.beta = toDegrees(Math.asin(newValues.b / newValues.c))
    }

    // Ensure alpha + beta = 90 degrees
    if (newValues.alpha && !newValues.beta) {
      newValues.beta = 90 - newValues.alpha
    } else if (newValues.beta && !newValues.alpha) {
      newValues.alpha = 90 - newValues.beta
    }

    // Calculate sides using trigonometric functions
    if (newValues.c && newValues.alpha && !newValues.a) {
      newValues.a = newValues.c * Math.sin(toRadians(newValues.alpha))
    }
    if (newValues.c && newValues.beta && !newValues.b) {
      newValues.b = newValues.c * Math.sin(toRadians(newValues.beta))
    }

    // Calculate height
    if (newValues.a && newValues.b && !newValues.height) {
      newValues.height = (newValues.a * newValues.b) / newValues.c!
    } else if (newValues.a && newValues.alpha && !newValues.height) {
      newValues.height = newValues.a * Math.tan(toRadians(newValues.alpha))
    } else if (newValues.b && newValues.beta && !newValues.height) {
      newValues.height = newValues.b * Math.tan(toRadians(newValues.beta))
    }

    // Calculate area
    if (!newValues.area && newValues.a && newValues.height) {
      newValues.area = (newValues.a * newValues.height) / 2
    } else if (!newValues.area && newValues.a && newValues.b) {
      newValues.area = (newValues.a * newValues.b) / 2
    }

    // Calculate perimeter
    if (!newValues.perimeter && newValues.a && newValues.b && newValues.c) {
      newValues.perimeter = newValues.a + newValues.b + newValues.c
    }

    // Round all values to 3 decimal places
    Object.keys(newValues).forEach((key) => {
      const value = newValues[key as keyof TriangleValues]
      if (typeof value === "number") {
        newValues[key as keyof TriangleValues] = Math.round(value * 1000) / 1000
      }
    })

    setValues(newValues)

    // Calculate triangle visualization points
    if (newValues.a && newValues.b) {
      const maxDimension = Math.max(newValues.a, newValues.b, newValues.c || 0)
      const scale = 120 / maxDimension
      const angleAlpha = newValues.alpha ? toRadians(newValues.alpha) : Math.PI / 4
      setTrianglePoints({
        x: newValues.b * scale,
        y: newValues.a * scale,
      })
    }
  }

  const handleInputChange = (field: keyof TriangleValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : Number.parseFloat(value),
    }))
  }

  const clearValues = () => {
    setValues({})
    setTrianglePoints({ x: 0, y: 0 })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl mx-auto dark">
        <CardHeader>
          <CardTitle className="text-2xl">Right Triangle Calculator</CardTitle>
          <CardDescription>
            Please provide 2 values below to calculate the other values of a right triangle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="side-a">Side a</Label>
                    <Input
                      id="side-a"
                      value={values.a || ""}
                      onChange={(e) => handleInputChange("a", e.target.value)}
                      type="number"
                      placeholder="Enter length"
                    />
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="angle-alpha">Angle α</Label>
                    <div className="flex gap-2">
                      <Input
                        id="angle-alpha"
                        value={values.alpha || ""}
                        onChange={(e) => handleInputChange("alpha", e.target.value)}
                        type="number"
                        placeholder="Enter angle"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="side-b">Side b</Label>
                    <Input
                      id="side-b"
                      value={values.b || ""}
                      onChange={(e) => handleInputChange("b", e.target.value)}
                      type="number"
                      placeholder="Enter length"
                    />
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="angle-beta">Angle β</Label>
                    <Input
                      id="angle-beta"
                      value={values.beta || ""}
                      onChange={(e) => handleInputChange("beta", e.target.value)}
                      type="number"
                      placeholder="Enter angle"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="side-c">Side c</Label>
                    <Input
                      id="side-c"
                      value={values.c || ""}
                      onChange={(e) => handleInputChange("c", e.target.value)}
                      type="number"
                      placeholder="Enter length"
                    />
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="height">Height h</Label>
                    <Input
                      id="height"
                      value={values.height || ""}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      type="number"
                      placeholder="Enter height"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={values.area || ""}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      type="number"
                      placeholder="Enter area"
                    />
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="perimeter">Perimeter</Label>
                    <Input
                      id="perimeter"
                      value={values.perimeter || ""}
                      onChange={(e) => handleInputChange("perimeter", e.target.value)}
                      type="number"
                      placeholder="Enter perimeter"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label>Angle Unit</Label>
                <Select value={angleUnit} onValueChange={setAngleUnit}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="degree">Degrees</SelectItem>
                    <SelectItem value="radian">Radians</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateTriangle} className="flex-1">
                  Calculate
                </Button>
                <Button onClick={clearValues} variant="outline" className="flex-1">
                  Clear
                </Button>
              </div>
            </div>

            <div className="relative aspect-square bg-black rounded-lg border p-6">
 <svg viewBox="25 0 180 180" className="w-full h-full">
  <g transform="translate(50, 150) scale(1, -1)">
    {/* Base line */}
    <line x1="0" y1="0" x2="140" y2="0" stroke="white" strokeWidth="2" />

    {/* Vertical line */}
    <line x1="0" y1="0" x2="0" y2="100" stroke="white" strokeWidth="2" />

    {/* Hypotenuse */}
    <line x1="0" y1="100" x2="140" y2="0" stroke="white" strokeWidth="2" />

    {/* Height line (altitude) - shortened to only go from right angle to hypotenuse */}
    <line x1="0" y1="0" x2="58" y2="58" stroke="white" strokeWidth="1" strokeDasharray="4 4" />

    {/* Right angle symbol */}
    <path d="M 0 10 L 10 10 L 10 0" fill="none" stroke="white" strokeWidth="2" />

    {/* Arc for angle α (bottom right) */}
    <path d="M 120 0 A 15 15 0 0 0 120 15" fill="none" stroke="white" strokeWidth="1" />

    {/* Arc for angle β (top left) */}
    <path d="M 0 80 A 15 15 0 0 1 15 89" fill="none" stroke="white" strokeWidth="1" />

    {/* Labels */}
    <g transform="scale(1, -1)" className="fill-white text-[12px]">
      {/* Beta angle - inside top left */}
      <text x="10" y="-70" textAnchor="start">
        β
      </text>

      {/* Vertical side a */}
      <text x="-10" y="-45" textAnchor="end">
        a
      </text>

      {/* Height h */}
      <text x="45" y="-20" textAnchor="end">
        h
      </text>

      {/* Hypotenuse c */}
      <text x="65" y="-60" textAnchor="start">
        c
      </text>

      {/* Base b */}
      <text x="70" y="15" textAnchor="middle">
        b
      </text>

      {/* Alpha angle - inside bottom right */}
      <text x="100" y="-8" textAnchor="start">
        α
      </text>
    </g>
  </g>
</svg></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

