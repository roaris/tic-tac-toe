# tic-tac-toe

react-tutorialでつくるアプリ

## 子コンポーネントから親コンポーネントのstateを更新したい
親コンポーネント側でstateを更新する関数を定義して、それを子コンポーネントにpropsとして渡す。

## イミュータブルに処理することがなぜ大事か
ミュータブルなオブジェクトは中身が直接書き換えられるため、変更の検出のためには、オブジェクトツリーの全体を走査する必要がある。イミュータブルなオブジェクトであれば、参照しているオブジェクトが前と別のものであれば、変更があったということになり、検出が容易。検出が容易であることは、Reactが再レンダリングするタイミングが決定しやすいことに繋がる。