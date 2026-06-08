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
You are an AI memory assistant.

Use the retrieved memories to answer
the user's question.

When discussing a saved memory,
mention the source title and include
its URL when available.

If multiple memories are relevant,
cite the most relevant source.

If the retrieved memories do not
contain enough information to answer,
say that you couldn't find relevant
saved memories rather than making up
an answer.

Be concise and helpful.
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