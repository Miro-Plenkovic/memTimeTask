export type HelloResponse = {
  message: string;
  time: string;
};

export type Response = {
  id: number;
  createdAt: Date;
  updatedAt: Date
};

export type ClientResponse = Response & {
  name: String;
  description: String;
  status: String
};

export type ProjectResponse = Response &{
  clientId: number;
  name: String;
  status: String
};
export type TaskResponse = Response &{
  parent: number;
  name: String;
  status: String
};
export type TimeEntryResponse = Response & {
  taskId:  number;
  userId: String;
  comment: String;
  start: Date;
  end: Date
};

export type TimeEntryRequest = Omit<TimeEntryResponse, "id" | "userId"| "updatedAt"| "createdAt">

export async function getHello(): Promise<HelloResponse> {
  const res = await fetch("/api/hello");
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getClients(page: number): Promise<ClientResponse[]> {
  const res = await fetch(`/api/getClients?page=${page*10}`);
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getProjects(id: number): Promise<ProjectResponse[]> {
  const res = await fetch(`/api/getProjects?id=${id}`);
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getTasks(id: number): Promise<TaskResponse[]> {
  const res = await fetch(`/api/getTasks?id=${id}`);
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getTimeEntries(page: number): Promise<TimeEntryResponse[]> {
  const res = await fetch(`/api/getTimeEntries?page=${page*10}`);
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function createTimeEntries(item: TimeEntryRequest): Promise<void> {
  const res = await fetch(`/api/createTimeEntries`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...item})});
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
}

export async function updateTimeEntries(item: TimeEntryRequest, id: number): Promise<void> {
  const res = await fetch(`/api/updateTimeEntries?id=${id}`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...item})});
  if (!res.ok) {
    if (res.status == 429) throw new Error("Too many requests");
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
