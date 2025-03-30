"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface DecryptorProps {
  privateKey: { d: number; n: number } | null
}

export default function Decryptor({ privateKey }: DecryptorProps) {
  const [encryptedInput, setEncryptedInput] = useState("")
  const [customPrivateKey, setCustomPrivateKey] = useState({
    d: "",
    n: "",
  })
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const decrypt = async () => {
    try {
      setError(null)
      setIsDecrypting(true)

      // Validate inputs
      if (!encryptedInput) {
        throw new Error("Please enter encrypted data")
      }

      let d: number
      let n: number

      if (privateKey) {
        // Use the provided private key
        d = privateKey.d
        n = privateKey.n
      } else {
        // Use custom private key
        d = Number.parseInt(customPrivateKey.d)
        n = Number.parseInt(customPrivateKey.n)

        if (isNaN(d) || isNaN(n)) {
          throw new Error("Please enter valid numbers for d and n")
        }
      }

      // Parse the encrypted input
      let encryptedArray: number[]
      try {
        encryptedArray = JSON.parse(encryptedInput)
        if (!Array.isArray(encryptedArray)) {
          throw new Error("Invalid format")
        }
      } catch (err) {
        throw new Error("Invalid encrypted data format. Please enter a valid JSON array.")
      }

      // Simulate a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Decrypt each number
      let decrypted = ""
      for (let i = 0; i < encryptedArray.length; i++) {
        const encryptedChar = encryptedArray[i]

        // Use modular exponentiation for decryption: m = (c^d) mod n
        // For large numbers, we need to use a more efficient algorithm
        // This is a simplified version for demonstration
        let decryptedChar = 1
        for (let j = 0; j < d; j++) {
          decryptedChar = (decryptedChar * encryptedChar) % n
        }

        decrypted += String.fromCharCode(decryptedChar)
      }

      setDecryptedMessage(decrypted)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsDecrypting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="encrypted-message">Encrypted Message (JSON Array)</Label>
        <Textarea
          id="encrypted-message"
          value={encryptedInput}
          onChange={(e) => setEncryptedInput(e.target.value)}
          placeholder="Enter the encrypted message as a JSON array"
          rows={4}
        />
        <p className="text-sm text-muted-foreground">Example: [123, 456, 789]</p>
      </div>

      {!privateKey && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="d-value">Private Key (d)</Label>
            <Input
              id="d-value"
              type="number"
              value={customPrivateKey.d}
              onChange={(e) => setCustomPrivateKey({ ...customPrivateKey, d: e.target.value })}
              placeholder="Enter d value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="n-value-private">Private Key (n)</Label>
            <Input
              id="n-value-private"
              type="number"
              value={customPrivateKey.n}
              onChange={(e) => setCustomPrivateKey({ ...customPrivateKey, n: e.target.value })}
              placeholder="Enter n value"
            />
          </div>
        </div>
      )}

      {privateKey && (
        <div className="space-y-2">
          <Label>Using Private Key</Label>
          <Card>
            <CardContent className="p-3 font-mono text-sm">{`d: ${privateKey.d}, n: ${privateKey.n}`}</CardContent>
          </Card>
        </div>
      )}

      <Button onClick={decrypt} disabled={isDecrypting} className="w-full">
        {isDecrypting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Decrypting...
          </>
        ) : (
          "Decrypt Message"
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {decryptedMessage && (
        <div className="space-y-2">
          <Label>Decrypted Message</Label>
          <Card>
            <CardContent className="p-3 font-mono text-sm break-all">{decryptedMessage}</CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

