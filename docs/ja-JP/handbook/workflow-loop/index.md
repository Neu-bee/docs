# ループ

<PluginInfo name="workflow-loop" link="/handbook/workflow-loop"></PluginInfo>

ループはプログラミング言語における `for` / `while` / `forEach` などの構文に相当します。一定回数または特定のデータ集合（配列）に対して操作を繰り返し実行する必要がある場合に、ループノードを使用できます。

## インストール

内蔵プラグインのため、インストールは不要です。

## 使用マニュアル

### ノードの作成

ワークフロー設定画面で、プロセス内のプラス（“+”）ボタンをクリックし、「ループ」ノードを追加します：

![ループノードの作成](https://static-docs.nocobase.com/b3c8061a66bfff037f4b9509ab0aad75.png)

ループノードを作成すると、内部に分岐が生成されます。この分岐には任意の数のノードを追加でき、これらのノードはフローコンテキストの変数を使用できるだけでなく、ループコンテキストのローカル変数も使用できます。例えば、ループ集合内の各データオブジェクトやループ回数のインデックス（インデックスは `0` からカウント開始）などです。ローカル変数のスコープはループ内部に限られ、多層のループがネストされている場合は、各層の具体的なループのローカル変数を使用できます。

### ノードの設定

#### ループ対象

ループはループ対象の異なるデータ型に応じて異なる処理を行います：

1. **配列**：最も一般的なケースで、通常はフローコンテキストの変数を選択できます。例えば、クエリノードの複数のデータ結果や、プリロードされた多対多関係のデータなどです。配列を選択した場合、ループノードは配列内の各要素を反復処理し、毎回のループで現在の要素をループコンテキストのローカル変数に代入します。

2. **数字**：選択した変数が数字の場合、その数字をループ回数として扱い、ローカル変数内のループ回数インデックスはループ対象の値となります。

3. **文字列**：選択した変数が文字列の場合、その文字列の長さをループ回数として扱い、インデックスに従って文字列内の各文字を処理します。

4. **その他**：その他の型の値（オブジェクト型を含む）は、単回処理のループ対象として扱われ、通常は一度だけループします。この場合、ループを使用する必要はありません。

変数を選択する代わりに、数字や文字列型の場合は定数を直接入力することもできます。例えば、`5`（数字型）を入力すると、ループノードは5回ループし、`abc`（文字列型）を入力すると、ループノードは3回ループしてそれぞれ `a`、`b`、`c` の3つの文字を処理します。変数選択ツールで、使用したい定数の型を選択してください。

### 例

例えば、注文を行う際には、注文内の各商品について在庫チェックを行い、在庫が十分であれば在庫を減少させ、そうでなければ注文明細内の商品を無効として更新します。

1. 三つのテーブルを作成します。商品テーブル <-(1:m)-- 注文明細テーブル --(m:1)-> 注文テーブル、データモデルは以下の通りです：

    | フィールド名     | フィールドタイプ       |
    | ---------------- | ---------------------- |
    | 注文商品明細     | 多対一（明細）         |
    | 注文総額         | 数字                   |

    | フィールド名     | フィールドタイプ       |
    | ---------------- | ---------------------- |
    | 商品             | 一対多（商品）         |
    | 数量             | 数字                   |

    | フィールド名     | フィールドタイプ       |
    | ---------------- | ---------------------- |
    | 商品名           | 単行テキスト           |
    | 価格             | 数字                   |
    | 在庫             | 整数                   |

2. ワークフローを作成し、トリガーとして「データテーブルイベント」を選択し、「注文」テーブルの「新規データ時」にトリガーされるよう設定します。また、事前に「注文明細」テーブルと明細内の商品の関係データを読み込む必要があります：

    ![ループノード_例_トリガー設定](https://static-docs.nocobase.com/0086601c2fc0e17a64d046a4c86b49b7.png)

3. ループノードを作成し、ループ対象を「トリガーデータ / 注文明細」として、注文明細テーブル内の各データに対して処理を行います：

    ![ループノード_例_ループノード設定](https://static-docs.nocobase.com/2507becc32db5a9a0641c198605a20da.png)

4. ループノード内部に「条件判断」ノードを作成し、商品の在庫が十分かどうかを判断します：

    ![ループノード_例_条件判断ノード設定](https://static-docs.nocobase.com/a6d08d15786841e1a3512b38e4629852.png)

5. 在庫が十分であれば、「はい」の分岐内に「計算ノード」と「データ更新ノード」を作成し、計算した在庫の減少を該当する商品のレコードに更新します：

    ![ループノード_例_計算ノード設定](https://static-docs.nocobase.com/8df3604c71f8f8705b1552d3ebfe3b50.png)

    ![ループノード_例_在庫更新ノード設定](https://static-docs.nocobase.com/2d84baa9b3b01bd85fccda9eec992378.png)

6. それ以外の場合は、「否」のブランチに「データ更新」ノードを作成し、注文明細のステータスを「無効」に更新します：

    ![ループノード_例_注文明細更新ノード設定](https://static-docs.nocobase.com/4996613090c254c69a1d80f3b3a7fae2.png)

全体のプロセス構造は以下の通りです：

![ループノード_例_プロセス構造](https://static-docs.nocobase.com/6f59ef246c1f19976344a7624c4c4151.png)

設定が完了し、このプロセスをアクティブにすると、新しい注文を作成する際に、注文明細内の商品の在庫が自動的に確認されます。在庫が十分であれば在庫が減少し、そうでなければ注文明細内の商品の状態が「無効」に更新されます（有効な注文総額を計算するため）。

