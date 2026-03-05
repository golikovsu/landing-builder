import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton'
import { Heading, Label, Text } from '@/components/ui/typography'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="mb-6 border-b border-[rgba(255,255,255,0.08)] pb-3">
        <Label variant="orange" size="md">
          {title}
        </Label>
      </div>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-bg-base px-6 py-12">
      <div className="mb-16">
        <Heading level={1} gradient className="mb-4">
          Design System
        </Heading>
        <Text variant="secondary" size="lg">
          IQ Option Landing Constructor — UI primitives and design tokens
        </Text>
      </div>

      <Section title="Typography">
        <div className="flex flex-col gap-6">
          <Heading level={1}>Heading 1 — 60px Black</Heading>
          <Heading level={2}>Heading 2 — 48px ExtraBold</Heading>
          <Heading level={3}>Heading 3 — 36px Bold</Heading>
          <Heading level={4}>Heading 4 — 28px Bold</Heading>
          <Heading level={2} gradient>
            Gradient Heading
          </Heading>
          <Text variant="primary">Primary text — white, readable body copy</Text>
          <Text variant="secondary">Secondary text — descriptions and supporting info</Text>
          <Text variant="muted">Muted text — hints, timestamps, labels</Text>
          <div className="flex items-center gap-4">
            <Label>Default Label</Label>
            <Label variant="orange">Orange Label</Label>
            <Label variant="muted">Muted Label</Label>
          </div>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-col gap-8">
          <div>
            <Text variant="muted" size="sm" className="mb-3">
              Variants
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="white">White</Button>
              <Button variant="dark">Dark</Button>
            </div>
          </div>
          <div>
            <Text variant="muted" size="sm" className="mb-3">
              Sizes
            </Text>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </div>
          <div>
            <Text variant="muted" size="sm" className="mb-3">
              States
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge variant="new" />
          <Badge variant="improved" />
          <Badge variant="fixed" />
          <Badge variant="coming-soon" />
          <Badge variant="deprecated" />
          <Badge variant="default">v3.0</Badge>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card variant="default">
            <CardHeader>
              <Heading level={4}>Default Card</Heading>
            </CardHeader>
            <CardBody>
              <Text variant="secondary" size="sm">
                Standard card with dark background, subtle border and drop shadow.
              </Text>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost">
                Learn more
              </Button>
            </CardFooter>
          </Card>
          <Card variant="raised">
            <CardHeader>
              <Heading level={4}>Raised Card</Heading>
            </CardHeader>
            <CardBody>
              <Text variant="secondary" size="sm">
                Slightly elevated — used for featured items.
              </Text>
            </CardBody>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heading level={4}>Bordered Card</Heading>
                <Badge variant="new" />
              </div>
            </CardHeader>
            <CardBody>
              <Text variant="secondary" size="sm">
                Hover reveals brighter border. Great for changelog entries.
              </Text>
            </CardBody>
          </Card>
          <Card variant="glow">
            <CardHeader>
              <Heading level={4}>Orange Glow Card</Heading>
            </CardHeader>
            <CardBody>
              <Text variant="secondary" size="sm">
                Orange border with glow shadow — for featured content.
              </Text>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Input label="Email" placeholder="you@example.com" type="email" />
          <Input label="Landing name" placeholder="My landing page" />
          <Input
            label="With hint"
            placeholder="Enter slug"
            hint="Lowercase letters, numbers and hyphens only"
          />
          <Input
            label="With error"
            placeholder="Enter value"
            error="This field is required"
            defaultValue="bad input"
          />
          <div className="sm:col-span-2">
            <Textarea
              label="Description"
              placeholder="Describe your landing page..."
              hint="Max 500 characters"
            />
          </div>
        </div>
      </Section>

      <Section title="Skeleton Loaders">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <div className="flex flex-col gap-3 rounded-lg bg-bg-card p-6">
            <Skeleton height={40} width={40} rounded="full" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </Section>

      <Section title="Color Palette">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'bg-base', bg: '#0c0e14' },
            { label: 'bg-raised', bg: '#131620' },
            { label: 'bg-card', bg: '#1a1e2d' },
            { label: 'bg-card-alt', bg: '#1f2335' },
            { label: 'orange', bg: '#ff6a00' },
            { label: 'orange-alt', bg: '#fe7a20' },
            { label: 'orange-light', bg: '#ffab5e' },
            { label: 'success', bg: '#2ecc71' },
            { label: 'error', bg: '#e74c3c' },
            { label: 'info', bg: '#3498db' },
            { label: 'warning', bg: '#f39c12' },
            { label: 'text-secondary', bg: '#9aa0b8' },
          ].map(({ label, bg }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="h-8 w-8 shrink-0 rounded border border-white/10"
                style={{ background: bg }}
              />
              <Text variant="muted" size="xs" as="span">
                {label}
              </Text>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
