class SharedFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer style="margin-top: 64px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; margin-bottom: 32px;">
          <a href="/terms" style="text-decoration: none; color: black; font-size: 14px;">Terms</a>
          <a href="/privacy" style="text-decoration: none; color: black; font-size: 14px;">Privacy</a>
          <a href="/refund" style="text-decoration: none; color: black; font-size: 14px;">Refund</a>
          <a href="/about" style="text-decoration: none; color: black; font-size: 14px;">About</a>
        </div>
        <div style="text-align: center; font-size: 12px; color: #666;">
          <p>OneClick is a fast Postman alternative and online API tester. Get instant curl to python code conversion, use it as a REST API client online, and debug APIs simply. The best simple API debugger for quick testing.</p>
          <div style="margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>Support:</span>
            <a href="mailto:xingfang.wang@gmail.com" style="text-decoration: none; color: #4f46e5;">xingfang.wang@gmail.com</a>
          </div>
        </div>
      </footer>
    `;
  }
}

if (!customElements.get('shared-footer')) {
  customElements.define('shared-footer', SharedFooter);
}
