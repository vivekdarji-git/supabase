import { makeObservable } from 'mobx'

import { API_URL, IS_PLATFORM } from 'lib/constants'

import { IRootStore } from '../RootStore'

export interface IMetaStore {
  projectRef?: string
  connectionString?: string

  setProjectDetails: (details: { ref: string; connectionString?: string }) => void
}
export default class MetaStore implements IMetaStore {
  rootStore: IRootStore

  projectRef: string
  connectionString?: string
  baseUrl: string
  headers: { [prop: string]: any }

  constructor(rootStore: IRootStore, options: { projectRef: string; connectionString?: string }) {
    const { projectRef, connectionString } = options
    this.rootStore = rootStore
    this.projectRef = projectRef
    this.baseUrl = `${API_URL}/pg-meta/${projectRef}`

    this.headers = {}
    if (IS_PLATFORM && connectionString) {
      this.connectionString = connectionString
      this.headers['x-connection-encrypted'] = connectionString
    }

    makeObservable(this, {})
  }

  setProjectDetails({ ref, connectionString }: { ref: string; connectionString?: string }) {
    this.projectRef = ref
    this.baseUrl = `${API_URL}/pg-meta/${ref}`
    if (IS_PLATFORM && connectionString) {
      this.connectionString = connectionString
      this.headers['x-connection-encrypted'] = connectionString
    }
  }
}
