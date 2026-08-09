// import app from '../../src/app';
import type { Express } from 'express';
import { expect } from 'vitest';
import request from 'supertest';
import { TestContext } from './helper/auth';
import TestAgent from 'supertest/lib/agent';
const toggleLogs = process.env.LOGS === 'true';
const endpoint = '/api/v1';
interface props {
  path: string;
  data?: object;
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
  async get({ path, statusCode = 200 }: props) {
    let fullPath = `${endpoint}${path}`;

    const res = await this.agent.get(fullPath).set(this.headers);
    expect(res.statusCode).toBe(statusCode);
    return res.body;
  }
  async post({ path, data, statusCode = 201 }: props) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.post(fullPath).send(data).set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
  async patch({ path, data, statusCode = 200 }: props) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.patch(fullPath).send(data).set(this.headers);
    expect(res.statusCode).toBe(statusCode);
    return res.body;
  }
  async put({ path, data, statusCode = 200 }: props) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.put(fullPath).send(data).set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
  async delete({ path, statusCode = 204 }: props) {
    let fullPath = `${endpoint}${path}`;
    const res = await this.agent.delete(fullPath).set(this.headers);
    expect(res.statusCode).toBe(statusCode);

    return res.body;
  }
}
