#!/usr/bin/env python3
"""Split spoken text and emit Gemini-compatible TTS job manifests."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def normalize_paragraphs(text: str) -> list[str]:
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    return [re.sub(r"\s+", " ", part).strip() for part in re.split(r"\n\s*\n+", text) if part.strip()]


def split_words(text: str, limit: int) -> list[str]:
    pieces: list[str] = []
    current = ""
    for word in text.split():
        if not current:
            current = word
        elif len(current) + len(word) + 1 <= limit:
            current += " " + word
        else:
            pieces.append(current)
            current = word
    if current:
        pieces.append(current)
    return pieces


def split_paragraph(text: str, limit: int) -> list[str]:
    if len(text) <= limit:
        return [text]
    pieces: list[str] = []
    current = ""
    for sentence in re.split(r"(?<=[.!?…])\s+", text):
        if len(sentence) > limit:
            if current:
                pieces.append(current)
                current = ""
            pieces.extend(split_words(sentence, limit))
        elif not current:
            current = sentence
        elif len(current) + len(sentence) + 1 <= limit:
            current += " " + sentence
        else:
            pieces.append(current)
            current = sentence
    if current:
        pieces.append(current)
    return pieces


def chunk_text(text: str, limit: int) -> list[str]:
    chunks: list[str] = []
    current = ""
    for paragraph in normalize_paragraphs(text):
        for piece in split_paragraph(paragraph, limit):
            if not current:
                current = piece
            elif len(current) + len(piece) + 2 <= limit:
                current += "\n\n" + piece
            else:
                chunks.append(current)
                current = piece
    if current:
        chunks.append(current)
    return chunks


def make_prompt(chunk: str, args: argparse.Namespace) -> str:
    parts = []
    if args.audio_profile:
        parts.extend(("### AUDIO PROFILE", args.audio_profile))
    if args.scene:
        parts.extend(("### SCENE", args.scene))
    if args.director_notes:
        parts.extend(("### DIRECTOR'S NOTES", args.director_notes))
    parts.extend(("### TRANSCRIPT", "Speak only the transcript below. Do not read headings or instructions aloud.", chunk))
    return "\n\n".join(parts)


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "narration"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", nargs="?", help="UTF-8 text or Markdown file")
    parser.add_argument("--text", help="Inline spoken text")
    parser.add_argument("--slug", help="Output folder and label stem; defaults to the input filename")
    parser.add_argument("--max-chars", type=int, default=1800)
    parser.add_argument("--format", choices=("tts-jobs", "manifest", "markdown"), default="tts-jobs")
    parser.add_argument("--voice", default="Kore", help="Gemini prebuilt voice (default: Kore)")
    parser.add_argument("--language", default="el-GR", help="BCP-47 language code (default: el-GR)")
    parser.add_argument("--audio-profile")
    parser.add_argument("--scene")
    parser.add_argument("--director-notes")
    parser.add_argument("--output", type=Path, help="Write output to this file instead of stdout")
    args = parser.parse_args()

    if bool(args.input) == bool(args.text):
        parser.error("provide exactly one of input or --text")
    if args.max_chars < 100:
        parser.error("--max-chars must be at least 100")
    text = args.text if args.text is not None else Path(args.input).read_text(encoding="utf-8")
    chunks = chunk_text(text, args.max_chars)
    if not chunks:
        parser.error("input contains no spoken text")

    slug = slugify(args.slug or (Path(args.input).stem if args.input else "narration"))
    source = args.input or "inline text"
    if args.format == "tts-jobs":
        result = json.dumps([
            {
                "label": f"{slug}-chunk-{index:03d}",
                "source": source,
                "outputPath": f"tmp/media/{slug}/{index:03d}.wav",
                "speechConfig": [{"voice": args.voice, "language": args.language}],
                "prompt": make_prompt(chunk, args),
            }
            for index, chunk in enumerate(chunks, start=1)
        ], ensure_ascii=False, indent=2) + "\n"
    elif args.format == "manifest":
        result = json.dumps({"maxChars": args.max_chars, "chunks": [
            {"index": index, "charCount": len(chunk), "text": chunk}
            for index, chunk in enumerate(chunks, start=1)
        ]}, ensure_ascii=False, indent=2) + "\n"
    else:
        result = "\n\n".join(f"## Chunk {index} ({len(chunk)} chars)\n\n{chunk}" for index, chunk in enumerate(chunks, start=1)) + "\n"

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(result, encoding="utf-8")
    else:
        sys.stdout.write(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
