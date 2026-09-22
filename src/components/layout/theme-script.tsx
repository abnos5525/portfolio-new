const themeBoot = `(function(){try{var stored=localStorage.getItem("theme")||"dark";var theme=stored==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):stored;if(theme!=="light"&&theme!=="dark")theme="dark";var root=document.documentElement;root.classList.remove("light","dark");root.classList.add(theme);root.style.colorScheme=theme}catch(e){}})();`

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
}
