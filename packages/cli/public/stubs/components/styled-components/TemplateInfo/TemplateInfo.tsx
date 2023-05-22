import { Styled } from './Intro.Style'
import { type BedframeTemplate } from '@bedframe/core'

export interface TemplateInfoProps {
  className?: string
  template?: BedframeTemplate
}

export function isObj(
  value: Record<string, any> | boolean | undefined
): boolean {
  return value === Object(value)
}

export function TemplateInfo({
  className,
  template,
}: TemplateInfoProps): JSX.Element {
  const xDetails = {
    name: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    description: chrome.runtime.getManifest().description,
    icon: chrome.runtime.getManifest().action.default_icon[128],
  }

  console.log('xDetails:', xDetails)
  return (
    <Styled.Intro className={className}>
      <dl>
        <dt>Name:</dt>
        <dd>{template?.name}</dd>
        <dt>Version:</dt>
        <dd>{template?.version}</dd>
        <dt>Description:</dt>
        <dd>{template?.description}</dd>
      </dl>
      <div>
        Config / Using:
        <dl>
          <dt>Language:</dt>
          <dd>{template?.config.language}</dd>
          <dt>Style:</dt>
          <dd>{template?.config.style}</dd>
          <dt>Lint &amp; Format:</dt>
          <dd>
            {isObj(template?.config.lintFormat) ? (
              <>
                iterate over <code>template?.config.lintFormat</code> Obj values
              </>
            ) : (
              <>{template?.config.lintFormat ?? undefined}</>
            )}
          </dd>
          <dt>Git Hooks:</dt>
          <dd>
            {isObj(template?.config.gitHooks) ? (
              <>
                iterate over <code>template?.config.gitHooks</code>Obj values
              </>
            ) : (
              <>{template?.config.gitHooks ?? undefined}</>
            )}
          </dd>
          <dt>Commit Lint:</dt>
          <dd>
            {isObj(template?.config.commitLint) ? (
              <>
                iterate over <code>template?.config.commitLint</code> Obj values
              </>
            ) : (
              <>{template?.config.commitLint ?? undefined}</>
            )}
          </dd>
          <dt>Semantic Release:</dt>
          <dd>
            {isObj(template?.config.changesets) ? (
              <>
                iterate over <code>template?.config.changesets</code> Obj values
              </>
            ) : (
              <>{template?.config.changesets ?? undefined}</>
            )}
          </dd>
          <dt>Tests:</dt>
          <dd>
            {isObj(template?.config.tests) ? (
              <>
                iterate over <code>template?.config.tests</code> Obj values
                <br />
                - unit
                <br />- e2e
              </>
            ) : (
              <>{template?.config.tests ?? undefined}</>
            )}
          </dd>
        </dl>
      </div>
    </Styled.Intro>
  )
}
