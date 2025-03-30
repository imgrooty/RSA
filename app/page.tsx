"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import KeyGenerator from "@/components/key-generator"
import Encryptor from "@/components/encryptor"
import Decryptor from "@/components/decryptor"

export default function Home() {
  const [keyPair, setKeyPair] = useState<{
    publicKey: { e: number; n: number } | null
    privateKey: { d: number; n: number } | null
  }>({
    publicKey: null,
    privateKey: null,
  })

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">RSA Encryption Tool</h1>
        <p className="text-muted-foreground max-w-[700px]">
          Generate RSA key pairs, encrypt messages with public keys, and decrypt messages with private keys.
        </p>
      </div>

      <div className="mt-10">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate Keys</TabsTrigger>
            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>RSA Key Generation</CardTitle>
                <CardDescription>
                  Generate a new RSA key pair by providing two prime numbers or let the system generate them for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KeyGenerator setKeyPair={setKeyPair} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="encrypt">
            <Card>
              <CardHeader>
                <CardTitle>Encrypt Message</CardTitle>
                <CardDescription>Encrypt a message using an RSA public key.</CardDescription>
              </CardHeader>
              <CardContent>
                <Encryptor publicKey={keyPair.publicKey} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="decrypt">
            <Card>
              <CardHeader>
                <CardTitle>Decrypt Message</CardTitle>
                <CardDescription>Decrypt a message using an RSA private key.</CardDescription>
              </CardHeader>
              <CardContent>
                <Decryptor privateKey={keyPair.privateKey} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

