# TODOアプリケーション

これは、Next.js、GraphQL、Prismaで構築されたモダンなTODOアプリケーションです。
このアプリケーションはクリーンアーキテクチャの原則に従い、タスクとユーザーを管理するための堅牢なAPIを提供します。

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [技術スタック](#%E6%8A%80%E8%A1%93%E3%82%B9%E3%82%BF%E3%83%83%E3%82%AF)
- [API ドキュメント](#api-%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88)
  - [GraphQLスキーマ](#graphql%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%9E)
  - [API操作](#api%E6%93%8D%E4%BD%9C)
  - [認証](#%E8%AA%8D%E8%A8%BC)
  - [ページネーション](#%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%8D%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)
- [アーキテクチャ](#%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3)
- [始め方](#%E5%A7%8B%E3%82%81%E6%96%B9)
- [デフォルトアカウント](#%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88)
  - [一般ユーザー](#%E4%B8%80%E8%88%AC%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC)
  - [管理者](#%E7%AE%A1%E7%90%86%E8%80%85)
- [AI実装について](#ai%E5%AE%9F%E8%A3%85%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)
- [詳細情報](#%E8%A9%B3%E7%B4%B0%E6%83%85%E5%A0%B1)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 技術スタック

- **フロントエンド**: App Routerを使用したNext.js
- **API**: Apollo ServerによるGraphQL
- **データベース**: SQLite用のPrisma ORM（他のデータベースにも設定可能）
- **認証**: 安全な認証のためのAuth0
- **アーキテクチャ**: 関心の分離を持つクリーンアーキテクチャ
- **テスト**: APIエンドポイントのエンドツーエンドテスト
- **ランタイム**: 高速なJavaScript実行のためのBun

## API ドキュメント

### GraphQLスキーマ

APIはGraphQLを使用して構築され、以下の主要な型を提供します：

#### タスク

```graphql
type Task {
  id: ID!
  userId: ID!
  title: String!
  description: String!
  completedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
  user: User!
}
```

#### ユーザー

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
  createdAt: DateTime!
  updatedAt: DateTime!
  tasks: TaskConnection!
}

enum UserRole {
  ADMIN
  EDITOR
}
```

### API操作

#### タスク操作

- **クエリ**:
  - `task(id: ID!): Task!` - IDによるタスクの取得
    - **権限**: ログインユーザーは自分のタスクのみアクセス可能。管理者は全てのタスクにアクセス可能。
  - `tasks(page: Int, perPage: Int, sortKey: TaskSortKey, sortOrder: SortOrder, q: String): TaskConnection!` - ソートとフィルタリング機能を持つページネーション付きタスクの取得
    - **権限**: 全てのログインユーザーがアクセス可能。ただし、一般ユーザーは自分のタスクのみ取得可能。

- **ミューテーション**:
  - `createTask(input: CreateTaskInput!): Task!` - 新しいタスクの作成
    - **権限**: 全てのログインユーザーが利用可能。作成されるタスクは自動的にユーザーに紐づけられる。
  - `updateTask(id: ID!, input: UpdateTaskInput!): Task!` - 既存タスクの更新
    - **権限**: ログインユーザーは自分のタスクのみ更新可能。管理者は全てのタスクを更新可能。
  - `completeTask(id: ID!): Task!` - タスクを完了としてマーク
    - **権限**: ログインユーザーは自分のタスクのみ完了可能。管理者は全てのタスクを完了可能。
  - `deleteTask(id: ID!): Task` - タスクの削除
    - **権限**: ログインユーザーは自分のタスクのみ削除可能。管理者は全てのタスクを削除可能。

#### ユーザー操作

- **クエリ**:
  - `me: User!` - 現在認証されているユーザーの取得
    - **権限**: 全てのログインユーザーが自分の情報にアクセス可能。
  - `user(id: ID!): User!` - IDによるユーザーの取得
    - **権限**: ログインユーザーは自分の情報のみアクセス可能。管理者は全てのユーザー情報にアクセス可能。
  - `users(page: Int, perPage: Int, sortKey: UserSortKey, sortOrder: SortOrder, name: String): UserConnection!` - ソートとフィルタリング機能を持つページネーション付きユーザーの取得
    - **権限**: 管理者のみがアクセス可能。

- **ミューテーション**:
  - `createUser(input: CreateUserInput!): User!` - 新しいユーザーの作成
    - **権限**: 管理者のみが利用可能。
  - `updateUser(id: ID!, input: UpdateUserInput!): User!` - 既存ユーザーの更新
    - **権限**: ログインユーザーは自分の情報のみ更新可能。管理者は全てのユーザー情報を更新可能。
  - `deleteUser(id: ID!): User` - ユーザーの削除
    - **権限**: ログインユーザーは自分のアカウントのみ削除可能。管理者は全てのユーザーを削除可能。

### 認証

APIは認証にAuth0を使用しています。アプリケーション内からのリクエストは、Auth0のセッション認証を使用して自動的に認証されます。これはNext.jsのミドルウェアによって処理されます。

### ページネーション

APIはリスト操作のためのオフセットベースのページネーションをサポートしています：

```graphql
type PageInfo {
  totalCount: Int!
  perPage: Int!
  totalPage: Int!
  currentPage: Int!
}

interface Edge {
  cursor: String!
  node: Node!
}

interface Connection {
  edges: [Edge!]!
  pageInfo: PageInfo!
}

enum SortOrder {
  asc
  desc
}
```

## アーキテクチャ

このアプリケーションは、関心事の明確な分離を持つクリーンアーキテクチャの原則に従っています：

- **ドメイン**: コアビジネスエンティティとルール
- **ユースケース**: アプリケーション固有のビジネスルール
- **インターフェースアダプター**: アプリケーションと外部インターフェース間のアダプター
- **フレームワーク**: 外部フレームワークとツール

## 始め方

### Auth0の設定

1. [Auth0のウェブサイト](https://auth0.com/)にアクセスし、アカウントを作成またはログインします。
2. 新しいアプリケーションを作成します：
   - ダッシュボードから「Applications」→「Create Application」を選択
   - アプリケーション名を入力（例：「TODO App」）
   - 「Regular Web Applications」を選択
   - 「Create」をクリック
3. アプリケーション設定を構成します：
   - 「Settings」タブで以下の項目を設定：
     - Allowed Callback URLs: `http://localhost:3000/auth/callback`
     - Allowed Logout URLs: `http://localhost:3000`
   - 「Save Changes」をクリック
4. 以下の情報をメモします：
   - Domain
   - Client ID
   - Client Secret

### 環境変数の設定

1. プロジェクトのルートディレクトリに `.env` ファイルを作成します（`.env.sample` をコピーして使用できます）
2. 以下の環境変数を設定します：

```
# Database
DATABASE_URL="file:./dev.db"

# SSO
# @see https://github.com/auth0/nextjs-auth0
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=a-long-random-string-at-least-32-characters
AUTH0_CONNECTION=Username-Password-Authentication
APP_BASE_URL=http://localhost:3000
```

- `AUTH0_DOMAIN`、`AUTH0_CLIENT_ID`、`AUTH0_CLIENT_SECRET` には、Auth0アプリケーション設定からメモした値を入力します
- `AUTH0_SECRET` には、32文字以上のランダムな文字列を生成して入力します（セッション暗号化に使用）
  - 例: 以下のコマンドを使用して生成できます: `openssl rand -hex 32`

### 開発サーバーの実行

```bash
# 依存関係のインストール
bun install

# 開発サーバーの実行
bun dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認します。

## デフォルトアカウント

アプリケーションを初期化すると、以下のデフォルトアカウントが作成されます：

### 一般ユーザー
- **名前**: 田中太郎
- **メールアドレス**: tanaka.tarou@example.com
- **パスワード**: Test1234
- **権限**: EDITOR（編集者）

### 管理者
- **名前**: 管理者
- **メールアドレス**: admin@example.com
- **パスワード**: Test1234
- **権限**: ADMIN（管理者）

これらのアカウントを使用してアプリケーションにログインできます。

## AI実装について

このプロジェクトには、Junie等のAIによる実装が含まれています。AIは主にコードの生成、最適化、およびドキュメント作成の支援に活用されています。

## 詳細情報

このプロジェクトで使用されている技術についての詳細情報：

- [Next.jsドキュメント](https://nextjs.org/docs)
- [GraphQLドキュメント](https://graphql.org/learn/)
- [Prismaドキュメント](https://www.prisma.io/docs)
- [Auth0ドキュメント](https://auth0.com/docs)
