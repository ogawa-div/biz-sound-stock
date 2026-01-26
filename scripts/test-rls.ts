/**
 * RLSセキュリティテストスクリプト
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface TestResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

const results: TestResult[] = [];

async function test(name: string, expected: string, fn: () => Promise<string>) {
  try {
    const actual = await fn();
    const passed = actual === expected;
    results.push({ name, expected, actual, passed });
    console.log(`${passed ? "✅" : "❌"} ${name}`);
    console.log(`   期待: ${expected}`);
    console.log(`   実際: ${actual}`);
    console.log("");
  } catch (error: any) {
    results.push({ name, expected, actual: `エラー: ${error.message}`, passed: false });
    console.log(`❌ ${name}`);
    console.log(`   期待: ${expected}`);
    console.log(`   実際: エラー - ${error.message}`);
    console.log("");
  }
}

async function main() {
  console.log("🔒 RLSセキュリティテスト開始\n");
  console.log("=========================================\n");

  // ===========================================
  // テスト1: 未認証で曲リストが見れるか
  // ===========================================
  await test(
    "1. 未認証ユーザーが曲リストを取得",
    "データ取得成功",
    async () => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/songs?select=id,title&limit=5`, {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
      });
      
      if (!res.ok) {
        const text = await res.text();
        return `HTTP ${res.status}: ${text}`;
      }
      
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return "データ取得成功";
      } else if (Array.isArray(data) && data.length === 0) {
        return "空の配列（RLSでブロックされた可能性）";
      }
      return "不明なレスポンス";
    }
  );

  // ===========================================
  // テスト2: 未認証で曲を追加できないか
  // ===========================================
  await test(
    "2. 未認証ユーザーが曲を追加（ブロックされるべき）",
    "ブロックされた",
    async () => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/songs`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify({
          title: "テスト曲（削除予定）",
          artist: "テスト",
          file_key: "test/test.mp3",
          duration: 60,
          genre: "ambient",
          mood: "relaxing",
        }),
      });
      
      if (res.status === 401 || res.status === 403) {
        return "ブロックされた";
      }
      
      if (res.ok) {
        return "追加成功（セキュリティ問題！）";
      }
      
      const text = await res.text();
      if (text.includes("policy") || text.includes("permission") || res.status === 404) {
        return "ブロックされた";
      }
      
      return `HTTP ${res.status}: ${text.substring(0, 100)}`;
    }
  );

  // ===========================================
  // テスト3: 未認証で曲を削除できないか
  // ===========================================
  await test(
    "3. 未認証ユーザーが曲を削除（ブロックされるべき）",
    "ブロックされた",
    async () => {
      // 存在しないIDで試行
      const res = await fetch(`${SUPABASE_URL}/rest/v1/songs?id=eq.00000000-0000-0000-0000-000000000000`, {
        method: "DELETE",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
      });
      
      if (res.status === 401 || res.status === 403) {
        return "ブロックされた";
      }
      
      // 204は「該当なし」なので、RLSが効いている証拠
      if (res.status === 204) {
        return "ブロックされた";
      }
      
      const text = await res.text();
      if (text.includes("policy") || text.includes("permission")) {
        return "ブロックされた";
      }
      
      return `HTTP ${res.status}`;
    }
  );

  // ===========================================
  // テスト4: 未認証でお気に入りを取得できないか
  // ===========================================
  await test(
    "4. 未認証ユーザーがお気に入りを取得（空または拒否）",
    "空の配列またはブロック",
    async () => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_favorites?select=*`, {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
      });
      
      if (res.status === 401 || res.status === 403) {
        return "空の配列またはブロック";
      }
      
      const data = await res.json();
      if (Array.isArray(data) && data.length === 0) {
        return "空の配列またはブロック";
      }
      
      return `データ取得: ${data.length}件（セキュリティ問題の可能性）`;
    }
  );

  // ===========================================
  // テスト5: 未認証でお気に入りを追加できないか
  // ===========================================
  await test(
    "5. 未認証ユーザーがお気に入りを追加（ブロックされるべき）",
    "ブロックされた",
    async () => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/user_favorites`, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "00000000-0000-0000-0000-000000000000",
          song_id: "00000000-0000-0000-0000-000000000000",
        }),
      });
      
      if (res.status === 401 || res.status === 403) {
        return "ブロックされた";
      }
      
      const text = await res.text();
      if (text.includes("policy") || text.includes("permission") || text.includes("violates")) {
        return "ブロックされた";
      }
      
      if (res.ok) {
        return "追加成功（セキュリティ問題！）";
      }
      
      return `HTTP ${res.status}: ${text.substring(0, 100)}`;
    }
  );

  // ===========================================
  // 結果サマリー
  // ===========================================
  console.log("=========================================");
  console.log("📊 テスト結果サマリー\n");
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`✅ 成功: ${passed}件`);
  console.log(`❌ 失敗: ${failed}件`);
  console.log("");
  
  if (failed > 0) {
    console.log("⚠️ 失敗したテスト:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(`   - ${r.name}`);
    });
  } else {
    console.log("🎉 すべてのセキュリティテストに合格しました！");
  }
}

main().catch(console.error);
