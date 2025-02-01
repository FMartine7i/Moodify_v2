export interface Song {
  id?: number
  name: string
  artist: string
  album: string
  image: string
  preview_url: string
  duration: string
  year?: string
  isFavorite?: boolean
}