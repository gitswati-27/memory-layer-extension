import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(
  question: string,
  context: string
) {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You answer questions only using
the provided context.

If the answer is not present,
say so.
`,
        },

        {
          role: "user",
          content: `
Context:

${context}

Question:

${question}
`,
        },
      ],
    });

  const answer =
  completion.choices[0]?.message?.content;

    if (!answer) {
    throw new Error(
        "No response received from Groq"
    );
    }

    return answer;
}