// Check if a number is prime
export const isPrime = (num: number): boolean => {
  if (num < 2) return false
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false
  }
  return true
}

// Generate a random prime number within a range
export const generatePrime = (min: number, max: number): number => {
  let num = Math.floor(Math.random() * (max - min + 1)) + min
  while (!isPrime(num)) {
    num = Math.floor(Math.random() * (max - min + 1)) + min
  }
  return num
}

// Calculate GCD (Greatest Common Divisor)
export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

// Calculate modular multiplicative inverse
export const modInverse = (e: number, phi: number): number => {
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

// Modular exponentiation for large numbers
export const modPow = (base: number, exponent: number, modulus: number): number => {
  if (modulus === 1) return 0

  let result = 1
  base = base % modulus

  while (exponent > 0) {
    // If exponent is odd, multiply base with result
    if (exponent % 2 === 1) {
      result = (result * base) % modulus
    }

    // Exponent must be even now
    exponent = Math.floor(exponent / 2)
    base = (base * base) % modulus
  }

  return result
}

