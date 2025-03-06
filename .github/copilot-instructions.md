# Copilot Instructions

## Project Overview

This project is a translation application that processes text and groups sentences for translation purposes.

<!-- 프로젝트의 간단한 설명입니다. -->

## Project Structure

- `lib/`: Contains utility functions and text processing logic.
- `src/`: Main application source code.
- `pages/`: Next.js pages for the application.
- `styles/`: Tailwind CSS styles and configurations.
- `tests/`: Unit tests for the application.
<!-- 프로젝트의 디렉토리 구조와 각 디렉토리의 역할을 설명합니다. -->

## Technologies Used

- TypeScript
- Node.js
- Next.js (using App Router)
- Tailwind CSS
- Jest (for testing)
<!-- 프로젝트에서 사용된 주요 기술들을 나열합니다. -->

## Coding Guidelines

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with TypeScript adaptations.
- Use `const` and `let` instead of `var`.
- Prefer arrow functions for anonymous functions.
- Use template literals for string concatenation.
<!-- 코딩 스타일과 가이드라인을 설명합니다. -->

## Specific Implementations

- **Text Processing**: Ensure that text processing functions handle special cases like page references (`p. 12`) correctly.
- **App Router**: The project uses an app router approach for handling routes. Ensure that new routes follow the existing structure.
- **Tailwind CSS**: Use Tailwind CSS for styling. Ensure that styles are consistent and follow the project's design guidelines.
<!-- 특정 구현 세부 사항을 설명합니다. -->

## Example Code Snippets

### Text Processing Function

```typescript
export function groupSentences(text: string): string[][] {
  // ...existing code...
}
```

<!-- 텍스트 처리 함수의 예제 코드입니다. -->

### App Router Example

```typescript
import { useRouter } from "next/router";

const ExamplePage = () => {
  const router = useRouter();

  return (
    <div>
      <h1>Example Page</h1>
      <button onClick={() => router.push("/another-page")}>
        Go to Another Page
      </button>
    </div>
  );
};

export default ExamplePage;
```

<!-- App Router를 사용하는 예제 코드입니다. -->

## Testing

- Write unit tests for all new functions and features.
- Use Jest for testing.
- Ensure that all tests pass before submitting a pull request.
<!-- 테스트 작성 및 실행에 대한 지침을 제공합니다. -->

## Contribution Guidelines

- Fork the repository and create a new branch for your feature or bugfix.
- Write clear and concise commit messages.
- Submit a pull request with a detailed description of your changes.
<!-- 기여 방법과 지침을 설명합니다. -->

## Preferences and Prompts

- Do not arbitrarily modify existing code. Only add what is necessary.
- Do not delete existing code. If deletion is necessary, clearly comment on the changes.
- Do not change variable names, function names, or file names arbitrarily.
- Do not alter existing logic unless it is necessary to fix an error.
- When adding parameters, ensure that type errors do not occur in functions that use them. If necessary, request the relevant code from the user.
<!-- 코드 작성 시 지켜야 할 선호 사항과 지침을 설명합니다. -->
