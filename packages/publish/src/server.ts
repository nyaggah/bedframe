type User = {
  name: string
  age: number
  yes: boolean
}
export function run(user: User) {
  console.log('me is:', user)
}

const me: User = {
  name: 'My Self',
  age: 21,
  yes: true,
}

run(me)

// TO diddly DO: move to @bedframe/core
enum GitProvider {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
  GITLAB = 'gitlab',
}

type RepoBugs = {
  url: string
  email?: string // TO diddly DO: type as email
}

type Git = {
  provider: GitProvider
  type: 'git'
  url: string
  directory?: string
  bugs: RepoBugs
}

const repository = {
  provider: 'github',
  type: 'git',
  url: 'https://github.com/nyaggah/bedframe.git',
  directory: 'packages/package',
  bugs: {
    url: 'https://github.com/nyaggah/bedframe/issues',
    email: 'joe@bedframe.dev',
  },
}
