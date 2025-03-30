# RSA Key Generator

This application is a simple RSA key generator built using React and TypeScript. It allows users to generate RSA key pairs by either providing their own prime numbers or letting the application generate them automatically.

## Features

- **Prime Number Generation**: Automatically generate prime numbers within a specified range.
- **Custom Prime Input**: Enter your own prime numbers for key generation.
- **Key Pair Display**: View the generated public and private keys.
- **Error Handling**: Provides feedback if invalid input is provided.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd RSA
   ```
3. Install the dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Application

To start the development server, run:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1. Choose whether to auto-generate prime numbers or enter your own.
2. Click the "Generate Key Pair" button.
3. View the generated public and private keys.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/).
- UI components provided by Radix UI.
