import React, { useState } from 'react';
import './index.css';

function App() {
  const [product, setProduct] = useState('');
  const [complaint, setComplaint] = useState('');
  const [request, setRequest] = useState('');
  const [requestMode, setRequestMode] = useState('input');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isFormValid = product.trim() !== '' && complaint.trim() !== '';

  const handleSubmit = async () => {
    setLoading(true);
    const finalRequest =
      requestMode === 'delegate'
        ? 'どのような対応が可能かご提示ください。'
        : request;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, complaint, request: finalRequest }),
      });

      const data = await response.json();
      setResult(data.message);
    } catch (error) {
      setResult('サーバーへの接続に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="app-container">
      <header>
        <h1>クレームAI</h1>
        <p className="lead">
          商品やサービスに関するクレーム文を、AIが冷静かつ交渉力ある文章に整えて提案します。
        </p>
      </header>

      <section className="card">
        <h2>このアプリの使い方</h2>
        <ul>
          <li>商品名とクレーム内容を入力します。</li>
          <li>要求内容は自分で記入するか、相手に提示を依頼できます。</li>
          <li>「交渉文を生成する」ボタンで文章が出力されます。</li>
          <li>生成された文章はコピーしてご利用ください。</li>
        </ul>
      </section>

      <main className="card">
        <label>商品名：</label>
        <input
          type="text"
          className="input-box"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="例：棚、モニター、冷蔵庫"
        />
        <div style={{ marginBottom: '16px' }}></div>

        <label>クレーム内容：</label>
        <textarea
          className="input-box"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="例：部品が足りなかった"
        />

        <label>要求内容：</label>
        <div className="button-toggle">
          <button
            className={requestMode === 'input' ? 'active' : ''}
            onClick={() => setRequestMode('input')}
          >
            自分で記入
          </button>
          <button
            className={requestMode === 'delegate' ? 'active' : ''}
            onClick={() => setRequestMode('delegate')}
          >
            相手に提示してもらう
          </button>
        </div>

        {requestMode === 'input' && (
          <textarea
            className="input-box"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="例：返金または交換を希望します"
          />
        )}

        <button onClick={handleSubmit} disabled={loading || !isFormValid}>
          {loading ? '生成中...' : '交渉文を生成する'}
        </button>

        {result && (
          <div className="result-section">
            <h3>生成された文章：</h3>
            <textarea readOnly value={result} className="full-height input-box" />
            <button onClick={handleCopy}>
              {copied ? 'コピーしました！' : 'コピーする'}
            </button>
          </div>
        )}
      </main>

      <section className="card disclaimer">
        <h2>免責</h2>
        <p>
          ※本アプリは、AIによるクレーム文章の自動生成を支援するものであり、法的な正確性や効果を保証するものではありません。実際のご利用はご自身の判断と責任にてお願いいたします。
        </p>
      </section>

      <footer className="footer">
        <p>© 2025 クレームAI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
