# TODOアプリケーション

これは、Next.js、GraphQL、Prismaで構築されたモダンなTODOアプリケーションです。
このアプリケーションはクリーンアーキテクチャの原則に従い、タスクとユーザーを管理するための堅牢なAPIを提供します。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

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

APIは認証にAuth0を使用しています。すべてのAPIリクエストは、Authorizationヘッダーに有効なJWTトークンが必要です：

```
Authorization: Bearer <token>
```

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

まず、開発サーバーを実行します：

```bash
# 依存関係のインストール
bun install

# データベースのセットアップ
bun prisma migrate dev

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
