
interface Section {
    title: string;
    content: string[];
}

export const formatAnalysisHTML = (analysis: string): Section[] => {
    try {
        const sections: Section[] = [];
        const lines = analysis.trim().split('\n');

        let currentSection: Section | null = null;

        const titlePatterns = [
            /^###?\s*(\d+\.?\s*)(.+)$/,           // ### 1. Title
            /^###?\s*([^.]+)分析\s*[:：]*$/,       // ### Something Analysis:
            /^###?\s*([^.]+)[:：]\s*$/,           // ### Title:
            /^###?\s*(.+)$/,                      // ### Title
            /^【([^】]+)】/,                      // 【Title】
            /^\d+\.?\s*(.+)$/,                   // 1. Title
            /^([^.]+)分析[:：]\s*$/               // Something Analysis:
        ];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            let isTitle = false;
            let extractedTitle = '';

            for (const pattern of titlePatterns) {
                const match = trimmedLine.match(pattern);
                if (match) {
                    isTitle = true;
                    extractedTitle = match[1] || trimmedLine; // Use group 1 if available, else line
                    // Wait, regex group indices vary.
                    // Pattern 1: group 2 is title. Match[1] is number prefix.
                    // Pattern 2: group 1 is title.
                    // Pattern 3: group 1 is title.

                    // Let's refine the logic to match the JS version more closely but type-safe.
                    // JS logic: extractedTitle = match[1] || trimmedLine;
                    // For pattern 1: match[1] is prefix, match[2] is text. So JS logic uses prefix? No.
                    // In JS regex: /^###?\s*(\d+\.?\s*)(.+)$/ -> match[1]=prefix, match[2]=content. match[0]=full.
                    // If match[1] is used, it returns prefix... that seems wrong in original JS if it wanted the title.
                    // Let's re-read JS:
                    /*
                    const match = trimmedLine.match(pattern);
                    if (match) {
                        isTitle = true;
                        extractedTitle = match[1] || trimmedLine;
                        break;
                    }
                    */
                    // For `### 1. Title`, match[1] is `1. `. match[2] is `Title`.
                    // If it uses match[1], the title becomes "1. ". That seems buggy in original JS or I misunderstood.
                    // Ah, `match[1]` might be the whole thing if no groups? No.
                    // Let's just implement a robust title extractor.
                    if (pattern.source.includes('(.+)')) {
                        // It has groups.
                        if (match.length >= 3 && pattern.source.startsWith('^###')) {
                            extractedTitle = match[2]; // e.g. "Title" from "1. Title"
                        } else if (match.length >= 2) {
                            extractedTitle = match[1];
                        } else {
                            extractedTitle = trimmedLine;
                        }
                    } else {
                        extractedTitle = trimmedLine;
                    }
                    break;
                }
            }

            // Simplified check: if line starts with # or 【 or is short and looks like title
            // Converting strict logic:
            if (isTitle && extractedTitle) {
                if (currentSection) sections.push(currentSection);
                currentSection = {
                    title: extractedTitle.trim().replace(/^#+\s*/, '').replace(/[:：]$/, ''),
                    content: []
                };
            } else {
                if (currentSection) {
                    currentSection.content.push(trimmedLine);
                } else {
                    currentSection = {
                        title: '詳細分析',
                        content: [trimmedLine]
                    }
                }
            }
        }

        if (currentSection) sections.push(currentSection);
        return sections;

    } catch (error) {
        console.error("Format error", error);
        return [{ title: 'Analysis', content: [analysis] }];
    }
}
