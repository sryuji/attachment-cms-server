import { v4 as uuidV4 } from 'uuid'

export function random(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

export function generateUUIDv4(): string {
  return uuidV4()
}

export function uniqueOnClient(): string {
  return new Date().getTime().toString(36) + random(1000).toString(36)
}
