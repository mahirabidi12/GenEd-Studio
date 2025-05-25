export function firstPrompt({title , description , duration , targetAudience , ageGroup}){
    let prompt = `You are an experienced and passionate teacher creating content for a student. Your task is to generate a detailed, engaging, and easy-to-understand transcript for an educational video.

This transcript will be used in an AI-powered educational video generator designed to revolutionize student learning by automating high-quality, personalized content creation. The goal is to make education more accessible and scalable through AI.

Please behave as if you're a teacher directly addressing your student. Keep the tone friendly, encouraging, and clear.

Here are the key parameters:
- **Topic**: ${title}
- **Objective**: ${description}
- **Duration**: ${duration} seconds
- **Target Audience**: ${targetAudience}
- **Age Group**: ${ageGroup}

Guidelines:
- Speak in a conversational, engaging way — like a tutor on video.
- Adapt your language and explanations to suit the specified age group and audience.
- Structure the script to fit within the given duration.
- Use analogies, real-world examples, and questions to keep the audience involved.
- End with a short recap or a motivating message to reinforce learning.

Return only the transcript. It will be converted into a video using AI. , don't have any emoji and gestures in the response and remember just send the exact transcript , don't add any marks or signs , it should be one piece of complete and continuous text without any metion of tacher behaviour , like he smiled or moved his hand`;

  return prompt;
}
// export function finalPrompt(transcript) {
//   return `You are a powerful AI assistant working within an AI-driven educational video generator.

// Your task is to take the following transcript and break it into a **sequence of concise, logically independent lines** that can stand alone when spoken by a digital persona. Each line should represent a distinct idea, sentence, or visual cue from the transcript.

// For each chunked line, return an object in the following format:
// \`\`\`json
// {
//   "id": (a unique number starting from 1),
//   "line": (a complete, self-contained line from the transcript),
//   "type": (either "image" or "video"),
//   "prompt": (a descriptive and contextually appropriate prompt to generate an AI image or video for this line)
// }
// \`\`\`

// ### Requirements:
// - Break the transcript into **meaningful, self-contained lines** that can be read aloud individually.
// - Assign \`type: "image"\` to **at least 60% of the lines**, based on which content would visually work better as a still illustration.
// - Assign \`type: "video"\` to the remaining lines, focusing on segments that involve actions, motion, or require continuity.
// - Write **clear, vivid prompts** for both image and video types to guide AI generation tools.
// - Each line should be educational, coherent, and suitable for the intended audience.
// - Avoid merging unrelated concepts into a single chunk.
// - Maintain natural order and preserve the meaning from the original transcript.

// ### Output Format:
// Return the output as a **pure JSON array of objects** like this:
// \`\`\`json
// [
//   {
//     "id": 1,
//     "line": "Plants make their own food using sunlight.",
//     "type": "image",
//     "prompt": "An illustration of a green plant under sunlight with arrows showing energy absorption from the sun."
//   },
//   {
//     "id": 2,
//     "line": "This process is called photosynthesis.",
//     "type": "video",
//     "prompt": "An animated sequence showing sunlight, carbon dioxide, and water combining inside a leaf to form glucose."
//   }
// ]
// \`\`\`

// Only return the final JSON array. Do not include explanations, headers, or commentary.

// Here is the transcript to process:
// """
// ${transcript}
// """
// `;
// }

// export function finalPrompt(transcript) {
//   return `You are a powerful AI assistant working within an AI-driven educational video generator.

// Your task is to analyze the following transcript and break it into a **sequence of short, logically independent lines** that can stand alone when spoken by a digital persona. Each line should represent a distinct idea, concept, or visual moment from the transcript.

// For each line, generate a JSON object in this format:
// \`\`\`json
// {
//   "id": (a unique number starting from 1),
//   "line": (a complete, self-contained line from the transcript),
//   "type": (either "image" or "video"),
//   "prompt": (a vivid and detailed prompt for generating an AI-based image or video)
// }
// \`\`\`

// ### Key Instructions:
// - Break the transcript into clear, **self-contained, educationally meaningful lines**.
// - Maintain the **natural order** and logical flow of the content.
// - **Exactly 50% of the lines should be labeled as "image"**, and the other **50% as "video"**.
// - Mark **anything that involves movement, transitions, changes over time, or would look visually appealing in motion** as \`"video"\`.
// - Use \`"image"\` for lines that can be represented by static, informative, or illustrative visuals.
// - Each prompt must be **descriptive, specific, and suitable** for AI-based generation tools like image or video generators.
// - Do **not merge unrelated ideas into a single line**. Each line should be independent and narratable.
// - Tailor all prompts to be **age-appropriate, educational, and visually rich**.

// ### Output Format:
// Return a **JSON array of objects only**, like this:
// \`\`\`json
// [
//   {
//     "id": 1,
//     "line": "The brain is divided into several key regions.",
//     "type": "image",
//     "prompt": "A labeled diagram of the human brain showing the frontal, parietal, occipital, and temporal lobes."
//   },
//   {
//     "id": 2,
//     "line": "When you hear your name in a noisy room, your brain filters out background noise.",
//     "type": "video",
//     "prompt": "A video sequence showing a crowded room, someone saying a name, and the listener’s brain highlighting the auditory cortex response."
//   }
// ]
// \`\`\`

// Return only the JSON array. Do not include explanations, titles, or extra formatting.

// Here is the transcript to process:
// """
// ${transcript}
// """
// `;
// }


export function finalPrompt(transcript) {
  return `You are a powerful AI assistant embedded in an AI-powered educational content creation tool.

Your role is to process the following transcript and convert it into a sequence of concise, logically independent lines that a digital persona can speak naturally, one at a time. Each line will be paired with a prompt to generate either an AI-generated **image** or **video**.

### Output Format
Return a **pure JSON array** of objects like this:
\`\`\`json
[ 
  {
    "id": 1,
    "line": "The brain is the control center of the human body.",
    "type": "video",
    "prompt": "A dynamic animation of the human brain lighting up as different regions activate to control thoughts and body functions."
  },
  {
    "id": 2,
    "line": "It is protected by the skull and suspended in cerebrospinal fluid.",
    "type": "image",
    "prompt": "A labeled anatomical illustration showing the human brain inside the skull, surrounded by cerebrospinal fluid."
  }
]
\`\`\`

### Instructions
- Break the transcript into **clear, self-contained lines** that are easy to speak individually.
- Assign **exactly 50% of the lines** as \`"image"\` and the other 50% as \`"video"\`.
- Mark **visually dynamic concepts** like **muscles, physics, brain activity, chemical reactions, body movement**, etc., as \`"video"\`.
- Mark **static concepts** such as **definitions, diagrams, simple objects, facts, and descriptions** as \`"image"\`.
- Flag anything that could look **visually stunning or benefit from motion** as \`"video"\`.
- Keep the natural order of ideas and **don’t merge unrelated concepts** into the same line.
- Write **descriptive and vivid prompts** that help another AI visualize the scene.
- All content should be **suitable for the specified age group**, educational, and visually clear.

Only return the final JSON array. Do not include commentary or markdown.

Here is the transcript to process:
"""
${transcript}
"""
`;
}
