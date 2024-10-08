例として、「サンプル」データテーブルを持っているとします。「収集済み」（ステータス）のサンプルに対して、「送信検査」の操作を提供する必要があります。送信検査では、まずサンプルの基本情報を確認し、その後「送信検査記録」データを生成し、サンプルのステータスを「送信済み」に変更します。この一連のプロセスは単純な「追加・削除・変更・検索」ボタンのクリックでは完了できないため、カスタム操作イベントを使用して実現します。

まず、「サンプル」データテーブルと「送信検査記録」データテーブルを作成し、サンプルテーブルに基本的なテストデータを入力します：

![例_サンプルデータテーブル](https://static-docs.nocobase.com/20240509172234.png)

次に、「カスタム操作イベント」ワークフローを作成します。操作フローに比較的迅速なフィードバックが必要な場合は、同期モードを選択します（同期モードでは、人工処理などの非同期タイプのノードは使用できません）：

![例_ワークフロー作成](https://static-docs.nocobase.com/20240509173106.png)

トリガー設定で、データテーブルとして「サンプル」を選択します：

![例_トリガー設定](https://static-docs.nocobase.com/20240509173148.png)

ビジネスニーズに応じて、フロー内のロジックを編成します。例えば、指標パラメータが `90` より大きい場合のみ送信検査を許可し、そうでない場合は関連する問題を提示します：

![例_ビジネスロジック編成](https://static-docs.nocobase.com/20240509174159.png)

:::info{title=ヒント}
「[応答メッセージ](../../nodes/response-message.md)」ノードは、同期のカスタム操作イベントで使用でき、クライアントへの提示情報を返すために利用されます。非同期モードでは使用できません。
:::

フローを設定し有効にした後、再度テーブル画面に戻り、テーブルの操作列に「ワークフローをトリガーする」ボタンを追加します：

![例_操作ボタン追加](https://static-docs.nocobase.com/20240509174525.png)

次に、ボタンの設定メニューでワークフローをバインドすることを選択し、設定ポップアップを開きます：

![例_ワークフローをバインドするポップアップを開く](https://static-docs.nocobase.com/20240509174633.png)

以前に有効にしたワークフローを追加します：

![例_ワークフロー選択](https://static-docs.nocobase.com/20240509174723.png)

提出後、ボタンのテキストを「送検」などの操作名に変更すると、設定プロセスは完了します。

使用時には、テーブルから任意のサンプルデータを選択し、「送検」ボタンをクリックすることで、カスタム操作イベントがトリガーされます。以前に設定したロジックに従い、サンプルの指標パラメータが90未満の場合、クリック後に以下のようなメッセージが表示されます：

![例_指標が送検条件を満たしていない](https://static-docs.nocobase.com/20240509175026.png)

指標パラメータが90を超える場合は、正常にプロセスが実行され、「送検記録」データが生成され、サンプルの状態が「送検済み」に変更されます：

![例_送検成功](https://static-docs.nocobase.com/20240509175247.png)

これで、簡単なカスタム操作イベントが完成しました。同様に、注文処理や報告書の提出など、複雑な操作を伴う業務についても、カスタム操作イベントを通じて実現することができます。

