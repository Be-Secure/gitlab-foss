import {
  extractCurrentDiscussion,
  extractDiscussions,
} from 'ee/design_management/utils/design_management_utils';

describe('extractCurrentDiscussion', () => {
  let discussions;

  beforeEach(() => {
    discussions = {
      edges: [
        { node: { id: 101, payload: 'w' } },
        { node: { id: 102, payload: 'x' } },
        { node: { id: 103, payload: 'y' } },
        { node: { id: 104, payload: 'z' } },
      ],
    };
  });

  it('finds the relevant discussion if it exists', () => {
    const id = 103;
    expect(extractCurrentDiscussion(discussions, id)).toEqual({
      node: { id, payload: 'y' },
    });
  });

  it('returns null if the relevant discussion does not exist', () => {
    expect(extractCurrentDiscussion(discussions, 0)).not.toBeDefined();
  });
});

describe('extractDiscussions', () => {
  let discussions;

  beforeEach(() => {
    discussions = {
      edges: [
        { node: { id: 1, notes: { edges: [{ node: 'a' }] } } },
        { node: { id: 2, notes: { edges: [{ node: 'b' }] } } },
        { node: { id: 3, notes: { edges: [{ node: 'c' }] } } },
        { node: { id: 4, notes: { edges: [{ node: 'd' }] } } },
      ],
    };
  });

  it('discards the edges.node artefacts of GraphQL', () => {
    expect(extractDiscussions(discussions)).toEqual([
      { id: 1, notes: ['a'] },
      { id: 2, notes: ['b'] },
      { id: 3, notes: ['c'] },
      { id: 4, notes: ['d'] },
    ]);
  });
});