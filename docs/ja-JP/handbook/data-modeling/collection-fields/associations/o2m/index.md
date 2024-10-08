# 一対多

クラスと生徒の関係は、一対多の関係の例です。1つのクラスには複数の生徒が所属しますが、生徒は1つのクラスにのみ所属できます。

ER関係は以下の通りです。

![alt text](https://static-docs.nocobase.com/9475f044d123d28ac8e56a077411f8dc.png)

フィールド設定は以下の通りです。

![alt text](https://static-docs.nocobase.com/a608ce54821172dad7e8ab760107ff4e.png)

## パラメータ説明

### ソースコレクション

ソースコレクション、つまり現在のフィールドが存在するコレクションです。

### ターゲットコレクション

ターゲットコレクション、関連付けるコレクションを示します。

### ソースキー

外部キー制約が参照するフィールドで、ユニークである必要があります。

### 外部キー

ターゲットコレクションのフィールドで、2つのコレクション間の関連を構築するために使用されます。

### ターゲットキー

ターゲットコレクションのフィールドで、関係ブロックの各行の記録を表示するために使用されます。一般的にユニークなフィールドです。

### ON DELETE

ON DELETEは、親コレクションのレコードを削除する際に関連する子コレクションの外部キー参照に対する操作ルールを指します。これは、外部キー制約を定義する際のオプションです。一般的なON DELETEオプションには以下があります：

- **CASCADE**：親コレクションのレコードを削除すると、自動的に子コレクションの関連するすべてのレコードも削除されます。
- **SET NULL**：親コレクションのレコードを削除すると、子コレクションの関連する外部キー値がNULLに設定されます。
- **RESTRICT**：デフォルトオプションで、親コレクションのレコードを削除しようとした際に、関連する子コレクションのレコードが存在する場合、削除を拒否します。
- **NO ACTION**：RESTRICTに似ており、関連する子コレクションのレコードが存在する場合、親コレクションのレコードの削除を拒否します。

