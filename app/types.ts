
type SimpleWord = {
  word: string
  start: number
  probability: number
  end: number
}
type SimpleSegment = {
  id: number
  start: number
  end: number
  words: SimpleWord[]
  speaker: string | null
}

type SimpleTranscript = {
  language: string
  text: string
  segments: SimpleSegment[]
}

type TimecodedLine = {
  tc: string, txt: string
}

type InterviewData = {
  name: string;
  audio_location: string;
  creator_id: number;
  id: number;
  status: string;
  speakers: Record<string, string>;
  transcript?: SimpleTranscript;
  transcript_duration_s?: number;
  transcript_ts?: Date;
  transcript_source?: string;
  // transcript_withtimecode: TimecodedLine[];
  update_ts: Date;
  upload_ts: Date;
}

type UserRead = {
  id: string,
  email: string,
  is_active: boolean,
  is_superuser: boolean,
  is_verified: boolean
}

class Unauthorized extends Error {}
