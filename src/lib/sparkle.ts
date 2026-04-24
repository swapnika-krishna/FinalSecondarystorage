export function createSparkleParticles(container: HTMLElement, color: string = 'var(--accent)') {
  const count = 12;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    const size = Math.random() * 3 + 2; // 2-5px
    
    sparkle.style.position = 'absolute';
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.backgroundColor = color;
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    
    // Initial position at center of container or mouse
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    sparkle.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5)`, opacity: 1, offset: 0.2 },
      { transform: `translate(calc(-50% + ${tx * 1.2}px), calc(-50% + ${ty * 1.2}px)) scale(0)`, opacity: 0 }
    ], {
      duration: 1500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: Math.random() * 200
    }).onfinish = () => sparkle.remove();
    
    fragment.appendChild(sparkle);
  }
  
  container.appendChild(fragment);
}
