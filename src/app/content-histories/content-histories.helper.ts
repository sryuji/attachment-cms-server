import { ElementType, parseDocument } from 'htmlparser2'
import render from 'dom-serializer'
import { Document, Element, isTag, isText } from 'domhandler'

export function normalizePath(path: string): string {
  path = path.trim()
  path = path.replace(/\/+/g, '/')
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  return path
}

export function normalizeContent(id: number, content: string): string {
  const document: Document = parseDocument(content)
  const htmlId = `acms-content-${id}`
  let rootNode = document.firstChild
  if (isTag(rootNode)) {
    rootNode.attribs['id'] = htmlId
  } else if (isText(rootNode)) {
    rootNode = new Element('span', { id: htmlId }, [rootNode], ElementType.Tag)
  } else {
    throw new Error('Bug')
  }
  // NOTE: render時、defaultでtagや日本語をencodeしてしまうのでfalse
  return render(rootNode, { decodeEntities: false })
}
