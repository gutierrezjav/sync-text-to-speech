# sync-text-to-speech

Tool to display a text, with line markers and synchronize the text position to live speech.

## Concept

### Workflow

1. Listen through microphone to someone reading a given large text (~5,000 words).
2. Convert audio, in parts/sentences, to text.
3. Find the line where the text part within the given large text is.
   - Note: these text parts might not be 100% match given audio recording and speech-to-text inaccuracies.
4. Send the line via push to a text reading app.
5. Text reading app, scrolls/highlights the given line of text.
6. Text reading app contains translations of the text, but line numbers must match.

### Parts

- Audio to text
- Text to line number
- Line number push
- Text reading

### How to start

```
> git clone https://github.com/gutierrezjav/sync-text-to-speech.git
> cd sync-text-to-speech
> code .
```

In Visual Studio, open terminal.

```
> npm install
> npm run dev
```
