"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface EncryptorProps {
  publicKey: { e: number; n: number } | null
}

export default function Encryptor({ publicKey }: EncryptorProps) {
  const [message, setMessage] = useState("")
  const [customPublicKey, setCustomPublicKey] = useState({
    e: "",
    n: "",
  })
  const [encryptedMessage, setEncryptedMessage] = useState<number[] | null>(null)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const encrypt = async () => {
    try {
      setError(null)
      setIsEncrypting(true)

      // Validate inputs
      if (!message) {
        throw new Error("Please enter a message to encrypt")
      }

      let e: number
      let n: number

      if (publicKey) {
        // Use the provided public key
        e = publicKey.e
        n = publicKey.n
      } else {
        // Use custom public key
        e = Number.parseInt(customPublicKey.e)
        n = Number.parseInt(customPublicKey.n)

        if (isNaN(e) || isNaN(n)) {
          throw new Error("Please enter valid numbers for e and n")
        }
      }

      // Simulate a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Encrypt each character
      const encrypted: number[] = []
      for (let i = 0; i < message.length; i++) {
        const charCode = message.charCodeAt(i)

        // Use modular exponentiation for encryption: c = (m^e) mod n
        // For large numbers, we need to use a more efficient algorithm
        // This is a simplified version for demonstration
        let encryptedChar = 1
        for (let j = 0; j < e; j++) {
          encryptedChar = (encryptedChar * charCode) % n
        }

        encrypted.push(encryptedChar)
      }

      setEncryptedMessage(encrypted)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsEncrypting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message">Message to Encrypt</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows={4}
        />
      </div>

      {!publicKey && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="e-value">Public Key (e)</Label>
            <Input
              id="e-value"
              type="number"
              value={customPublicKey.e}
              onChange={(e) => setCustomPublicKey({ ...customPublicKey, e: e.target.value })}
              placeholder="Enter e value"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="n-value">Public Key (n)</Label>
            <Input
              id="n-value"
              type="number"
              value={customPublicKey.n}
              onChange={(e) => setCustomPublicKey({ ...customPublicKey, n: e.target.value })}
              placeholder="Enter n value"
            />
          </div>
        </div>
      )}

      {publicKey && (
        <div className="space-y-2">
          <Label>Using Public Key</Label>
          <Card>
            <CardContent className="p-3 font-mono text-sm">{`e: ${publicKey.e}, n: ${publicKey.n}`}</CardContent>
          </Card>
        </div>
      )}

      <Button onClick={encrypt} disabled={isEncrypting} className="w-full">
        {isEncrypting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Encrypting...
          </>
        ) : (
          "Encrypt Message"
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {encryptedMessage && (
        <div className="space-y-2">
          <Label>Encrypted Message</Label>
          <Card>
            <CardContent className="p-3 font-mono text-sm break-all">{JSON.stringify(encryptedMessage)}</CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            This is the encrypted message as an array of numbers. Save this along with the private key to decrypt later.
          </p>
        </div>
      )}
    </div>
  )
}

