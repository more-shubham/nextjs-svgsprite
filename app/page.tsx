import Icon, { IconWithLabel } from '@/components/Icon';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Next.js SVG Sprite Plugin Example</h1>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>Basic Icons</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <Icon name="home" size={24} />
          <Icon name="user" size={24} />
          <Icon name="settings" size={24} />
          <Icon name="search" size={24} />
          <Icon name="star" size={24} />
        </div>
      </section>
      
      <section style={{ marginTop: '2rem' }}>
        <h2>TypeScript Autocomplete</h2>
        <p>
          When using TypeScript, your IDE will suggest icon names: 
          <code>home</code>, <code>user</code>, <code>settings</code>, 
          <code>search</code>, <code>star</code>
        </p>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Try typing <code>&lt;Icon name="</code> in a TypeScript file to see the autocomplete in action!
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Different Sizes</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <Icon name="home" size={16} />
          <Icon name="home" size={24} />
          <Icon name="home" size={32} />
          <Icon name="home" size={48} />
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Custom Colors</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <Icon name="home" size={32} color="red" />
          <Icon name="user" size={32} color="blue" />
          <Icon name="settings" size={32} color="green" />
          <Icon name="search" size={32} color="purple" />
          <Icon name="star" size={32} color="gold" />
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>With Labels (Accessible)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <IconWithLabel name="home" label="Home page" size={24} />
          <IconWithLabel name="user" label="User profile" size={24} />
          <IconWithLabel name="settings" label="Settings" size={24} />
          <IconWithLabel name="search" label="Search" size={24} />
          <IconWithLabel name="star" label="Favorite" size={24} />
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Namespaced Icons</h2>
        <p style={{ marginBottom: '1rem' }}>
          Icons organized in folders use namespace syntax (e.g., <code>social:facebook</code>)
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon name="social:facebook" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>social:facebook</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="social:twitter" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>social:twitter</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="brands:apple" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>brands:apple</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Icon name="brands:google" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>brands:google</div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Normalized Names</h2>
        <p style={{ marginBottom: '1rem' }}>
          All icon names are automatically normalized to kebab-case. For example:
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon name="sun-moon" size={32} />
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              sun-moon
            </div>
            <div style={{ fontSize: '0.6rem', color: '#666' }}>
              (from sunMoon, SunMoon, sun_moon, etc.)
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Sprite Information</h2>
        <p>The SVG sprite is served at <code>/icons</code></p>
        <p>View the sprite: <a href="/icons" target="_blank">/icons</a></p>
      </section>
    </div>
  );
}
