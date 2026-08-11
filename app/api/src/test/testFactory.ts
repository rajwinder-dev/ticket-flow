import type { Express } from 'express';
import { expect } from 'vitest';
import request from 'supertest';
import { CreateUserInput, TestContext } from './helper/auth';
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
  private auth = new TestContext();
  orgId!: string;
  constructor(app: Express) {
    this.logs = toggleLogs;
    this.agent = request.agent(app);
  }
  async authenticate({data, userId}:{data?: Partial<CreateUserInput>, userId?: string} = {}) {
    await this.auth.authenticate({ data ,userId});
    this.headers = {
      ...this.auth.headers,
      ...this.auth.orgHeader,
    };
  }
  async cleanup() {
    await this.auth.cleanup();
  }
  getUserData() {
    return this.auth.getUserData();
  }
  createUser() {
    return this.auth.createAuthUser();
  }
  async setOrgId(orgId: string) {
    await this.auth.setOrg(orgId);
    this.headers = {
      ...this.auth.headers,
      ...this.auth.orgHeader,
    };
    this.orgId = orgId;
  }
  async get<T>({
    path,
    statusCode = 200,
  }: props<T>): Promise<{ success: boolean; data: T }> {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.get(fullPath).set(this.headers);
    try {
      expect(res.statusCode).toBe(statusCode);
    } catch (error) {
      console.dir(res.body);
      throw error;
    }
    return res.body;
  }
  async post<T>({ path, body, statusCode = 201 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .post(fullPath)
      .send(body ?? {})
      .set(this.headers);
    try {
      expect(res.statusCode).toBe(statusCode);
    } catch (error) {
      console.dir(res.body);
      throw error;
    }
    return res.body;
  }
  async patch<T>({ path, body, statusCode = 200 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .patch(fullPath)
      .send(body ?? {})
      .set(this.headers);
    try {
      expect(res.statusCode).toBe(statusCode);
    } catch (error) {
      console.dir(res.body);
      throw error;
    }
    return res.body;
  }
  async put<T>({ path, body, statusCode = 200 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .put(fullPath)
      .send(body ?? {})
      .set(this.headers);
    try {
      expect(res.statusCode).toBe(statusCode);
    } catch (error) {
      console.dir(res.body);
      throw error;
    }

    return res.body;
  }
  async delete<T>({ path, body, statusCode = 204 }: props<T>) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent
      .delete(fullPath)
      .send(body ?? {})
      .set(this.headers);
    try {
      expect(res.statusCode).toBe(statusCode);
    } catch (error) {
      console.dir(res.body);
      throw error;
    }

    return res.body;
  }
}
