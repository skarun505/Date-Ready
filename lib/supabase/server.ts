import { createClient, SupabaseClient } from "@supabase/supabase-js";

// In-memory fallback repository when Supabase credentials are not yet configured in .env.local
interface InMemoryDB {
  users: Map<string, any>;
  assessments: Map<string, any>;
  answers: any[];
  purchases: Map<string, any>;
  reports: Map<string, any>;
  webhookEvents: Map<string, any>;
}

const memoryDB: InMemoryDB = {
  users: new Map(),
  assessments: new Map(),
  answers: [],
  purchases: new Map(),
  reports: new Map(),
  webhookEvents: new Map(),
};

// Seed initial memory database with a sample test assessment
memoryDB.assessments.set("mock-assessment-demo", {
  id: "mock-assessment-demo",
  user_id: "demo-user-id",
  quiz_version: "v1",
  completed_at: new Date().toISOString(),
  total_score: 65,
  profile: "The Developing",
  approach: 10,
  conversation: 16,
  social: 14,
  resilience: 11,
  presentation: 14,
  primary_weakness: "approach",
  secondary_weakness: "resilience",
  report_key: "approach__resilience",
});

let serverInstance: SupabaseClient | null = null;

export function serverClient(): SupabaseClient | any {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key && url.startsWith("http")) {
    if (!serverInstance) {
      serverInstance = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
    return serverInstance;
  }

  // Graceful fallback mock client mirroring Supabase query builder for local development
  return {
    isMock: true,
    from: (table: string) => {
      const getCollection = () => {
        switch (table) {
          case "users":
            return memoryDB.users;
          case "assessments":
            return memoryDB.assessments;
          case "purchases":
            return memoryDB.purchases;
          case "reports":
            return memoryDB.reports;
          case "webhook_events":
            return memoryDB.webhookEvents;
          default:
            return new Map();
        }
      };

      return {
        select: (columns: string = "*") => {
          let filterCol: string | null = null;
          let filterVal: any = null;

          const query: any = {
            eq: (col: string, val: any) => {
              filterCol = col;
              filterVal = val;
              return query;
            },
            single: async () => {
              const col = getCollection();
              for (const item of col.values()) {
                if (filterCol && item[filterCol] === filterVal) {
                  return { data: item, error: null };
                }
              }
              return { data: null, error: { message: "Row not found", code: "PGRST116" } };
            },
            maybeSingle: async () => {
              const col = getCollection();
              for (const item of col.values()) {
                if (filterCol && item[filterCol] === filterVal) {
                  return { data: item, error: null };
                }
              }
              return { data: null, error: null };
            },
            then: (resolve: (res: { data: any; error: any }) => void) => {
              const col = getCollection();
              let results: any[] = [];
              for (const item of col.values()) {
                if (!filterCol || item[filterCol] === filterVal) {
                  results.push(item);
                }
              }
              resolve({ data: results, error: null });
            },
          };
          return query;
        },
        insert: (rows: any) => {
          const arr = Array.isArray(rows) ? rows : [rows];
          const col = getCollection();
          for (const item of arr) {
            const id = item.id || crypto.randomUUID();
            const withId = { ...item, id, created_at: item.created_at || new Date().toISOString() };
            if (col.has(id)) {
              return Promise.resolve({
                data: null,
                error: { code: "23505", message: "Duplicate key" },
              });
            }
            col.set(id, withId);
          }
          return {
            select: () => ({
              single: async () => ({ data: arr[0], error: null }),
            }),
            then: (resolve: any) => resolve({ data: arr, error: null }),
          };
        },
        update: (updates: any) => ({
          eq: (col: string, val: any) => {
            const collection = getCollection();
            let updatedItem: any = null;
            for (const [id, item] of collection.entries()) {
              if (item[col] === val) {
                const merged = { ...item, ...updates };
                collection.set(id, merged);
                updatedItem = merged;
              }
            }
            return Promise.resolve({ data: updatedItem, error: null });
          },
        }),
      };
    },
  };
}
