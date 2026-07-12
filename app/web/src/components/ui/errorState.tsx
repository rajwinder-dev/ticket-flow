"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

type ErrorStateProps = {
  title?: string
  message: string
  buttonText?: string
  onAction?: () => void
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  buttonText = "Go back",
  onAction,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">

          {/* Icon */}
          <div className="bg-destructive/10 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>

          {/* Alert */}
          <Alert variant="destructive" className="text-left">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {/* Action Button */}
          {onAction && (
            <Button className="w-full mt-2" onClick={onAction}>
              {buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
