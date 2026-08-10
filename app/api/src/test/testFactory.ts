// import app from '../../src/app';
import type { Express } from 'express';
import { expect } from 'vitest';
import request from 'supertest';
import { TestContext } from './helper/auth';
import TestAgent from 'supertest/lib/agent';
const toggleLogs = process.env.LOGS === 'true';
const endpoint = '/api/v1';
interface props<T> {
  path: string;
  body?: Partial<T>;
  statusCode?: number;
}

export class TestFactory {
  logs?: boolean;
  headers!: Record<string, string>;
  agent: TestAgent;
  auth = new TestContext();
  constructor(app: Express) {
    this.logs = toggleLogs;
    this.agent = request.agent(app);
  }
  async authenticate() {
    await this.auth.authenticate();
    this.headers = {
      ...this.auth.headers,
      ...this.auth.orgHeader,
    };
  }
  async cleanup() {
    await this.auth.cleanup();
  }
   getUserData() {
    return  this.auth.getUserData();
  }
  async setOrgId(orgId: string) {
    await this.auth.setOrg(orgId);
    this.headers = {
      ...this.auth.headers,
      ...this.auth.orgHeader,
    };
  }
  async get<T>({
    path,
    statusCode = 200,
  }: props<T>): Promise<{ success: boolean; data: T }> {
    let fullPath = `${endpoint}${path}`;

    const res = await this.agent.get(fullPath).set(this.headers);
    expect(res.statusCode).toBe(statusCode);
    return res.body;
  }
  async post<T>({ path, body, statusCode = 201 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .post(fullPath)
      .send(body ?? {})
      .set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
  async patch<T>({ path, body, statusCode = 200 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .patch(fullPath)
      .send(body ?? {})
      .set(this.headers);
    expect(res.statusCode).toBe(statusCode);
    return res.body;
  }
  async put<T>({ path, body, statusCode = 200 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .put(fullPath)
      .send(body ?? {})
      .set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
  async delete<T>({ path, statusCode = 204 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.delete(fullPath).set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
}
