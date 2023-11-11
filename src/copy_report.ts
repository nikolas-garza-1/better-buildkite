interface RichText {
    text: string;
    link?: string;
    name?: string;
    machineName?: string;
    selectedText?: string;
    stepsTakenToTriage?: string;
    additionalNotes?: string;
  }
  
  function formatRichText(richText: RichText): string {
    const text = `
      <b>Link to test</b><br/>
      <a href="${richText.link}">${richText.link}</a><br/><br/>
      <b>Name of test</b><br/>
      ${richText.name}<br/><br/>
      <b>Name of machine</b><br/>
      ${richText.machineName}<br/><br/>
      <b>Error/issue with test</b><br/>
      <pre><code>${richText.selectedText}</code></pre><br/>
      <b>Steps taken to triage</b><br/>
      ${richText.stepsTakenToTriage || 'ADD STEPS TO TRIAGE'}<br/><br/>
      <b>Additional notes</b><br/>
      ${richText.additionalNotes || '<i>left blank</i>'}<br/>
    `;
  
    return text;
  }
  
  function copyRichText(richText: RichText): void {
    const listener = (ev: Event) => {
      ev.preventDefault();
      navigator.clipboard.writeText(formatRichText(richText));
    };
  
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }
  
  const selection = window.getSelection();
  const selectedText = selection?.toString() || '';
  let node = selection?.focusNode || null;
  
  if (node?.nodeType !== 1) {
    node = node?.parentNode;
  }
  
  const failedStep = node?.closest('.build-details-pipeline-job.build-details-pipeline-job-expanded') as HTMLElement | null;
  
  if (!failedStep) {
    return;
  }
  
  const header: HTMLElement | null = failedStep.children[0];
  
  const text: RichText = {
    text: '',
    link: `${windowLocation.split('#')[0]}#${failedStep.id.substring(4)}`,
    name: header.querySelectorAll('[data-testid="JobName"]')[0].innerText,
    machineName: header.querySelectorAll('.fa-cube')[0].parentNode.children[1].innerText,
    selectedText,
  };
  
  copyRichText(text);
  