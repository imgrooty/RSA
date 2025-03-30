"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KeyGeneratorProps {
  setKeyPair: (keyPair: {
    publicKey: { e: number; n: number }
    privateKey: { d: number; n: number }
  }) => void
}

export default function KeyGenerator({ setKeyPair }: KeyGeneratorProps) {
  const [p, setP] = useState("")
  const [q, setQ] = useState("")
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedKeys, setGeneratedKeys] = useState<{
    publicKey: { e: number; n: number } | null
    privateKey: { d: number; n: number } | null
    p: number | null
    q: number | null
  }>({
    publicKey: null,
    privateKey: null,
    p: null,
    q: null,
  })
  const [error, setError] = useState<string | null>(null)

  // Check if a number is prime
  const isPrime = (num: number): boolean => {
    if (num < 2) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false
    }
    return true
  }

  // Generate a random prime number within a range
  const generatePrime = (min: number, max: number): number => {
    let num = Math.floor(Math.random() * (max - min + 1)) + min
    while (!isPrime(num)) {
      num = Math.floor(Math.random() * (max - min + 1)) + min
    }
    return num
  }

  // Calculate GCD (Greatest Common Divisor)
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  // Calculate modular multiplicative inverse
  const modInverse = (e: number, phi: number): number => {
    const m0 = phi
    let y = 0
    let x = 1

    if (phi === 1) return 0

    while (e > 1) {
      // q is quotient
      const q = Math.floor(e / phi)
      let t = phi

      // phi is remainder now, process same as Euclid's algorithm
      phi = e % phi
      e = t
      t = y

      // Update y and x
      y = x - q * y
      x = t
    }

    // Make x positive
    if (x < 0) x += m0

    return x
  }

  const generateKeys = async () => {
    try {
      setError(null)
      setIsGenerating(true)

      // Simulate a delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      let primeP: number
      let primeQ: number

      if (autoGenerate) {
        // Generate random prime numbers
        primeP = generatePrime(100, 1000)
        primeQ = generatePrime(100, 1000)
      } else {
        // Use user-provided prime numbers
        const userP = Number.parseInt(p)
        const userQ = Number.parseInt(q)

        if (isNaN(userP) || isNaN(userQ)) {
          throw new Error("Please enter valid numbers for p and q")
        }

        if (!isPrime(userP) || !isPrime(userQ)) {
          throw new Error("Both p and q must be prime numbers")
        }

        primeP = userP
        primeQ = userQ
      }

      // Calculate n = p * q
      const n = primeP * primeQ

      // Calculate Euler's totient function: phi = (p-1) * (q-1)
      const phi = (primeP - 1) * (primeQ - 1)

      // Choose e (public exponent) such that 1 < e < phi and gcd(e, phi) = 1
      let e = 65537 // Common value for e
      while (gcd(e, phi) !== 1) {
        e = Math.floor(Math.random() * (phi - 3)) + 3
      }

      // Calculate d (private exponent), the modular multiplicative inverse of e
      const d = modInverse(e, phi)

      const keyPair = {
        publicKey: { e, n },
        privateKey: { d, n },
        p: primeP,
        q: primeQ,
      }

      setGeneratedKeys(keyPair)
      setKeyPair({
        publicKey: { e, n },
        privateKey: { d, n },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch id="auto-generate" checked={autoGenerate} onCheckedChange={setAutoGenerate} />
        <Label htmlFor="auto-generate">Auto-generate prime numbers</Label>
      </div>

      {!autoGenerate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="p-value">Prime number p</Label>
            <Input
              id="p-value"
              type="number"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="Enter a prime number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q-value">Prime number q</Label>
            <Input
              id="q-value"
              type="number"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Enter a prime number"
            />
          </div>
        </div>
      )}

      <Button onClick={generateKeys} disabled={isGenerating} className="w-full">
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Key Pair"
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedKeys.publicKey && generatedKeys.privateKey && (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Generated Key Pair</h3>

          {generatedKeys.p && generatedKeys.q && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Prime p</Label>
                <Card>
                  <CardContent className="p-3 font-mono text-sm break-all">{generatedKeys.p}</CardContent>
                </Card>
              </div>
              <div className="space-y-1">
                <Label>Prime q</Label>
                <Card>
                  <CardContent className="p-3 font-mono text-sm break-all">{generatedKeys.q}</CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Label>Public Key (e, n)</Label>
            <Card>
              <CardContent className="p-3 font-mono text-sm break-all">
                {`e: ${generatedKeys.publicKey.e}, n: ${generatedKeys.publicKey.n}`}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-1">
            <Label>Private Key (d, n)</Label>
            <Card>
              <CardContent className="p-3 font-mono text-sm break-all">
                {`d: ${generatedKeys.privateKey.d}, n: ${generatedKeys.privateKey.n}`}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

