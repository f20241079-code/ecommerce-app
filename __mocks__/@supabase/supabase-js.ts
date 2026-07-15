const noopResponse = { data: null, error: null };

const createNoopQueryBuilder = () => {
  const builder: any = {
    select: async () => noopResponse,
    insert: async () => noopResponse,
    upsert: async () => noopResponse,
    update: async () => noopResponse,
    delete: async () => noopResponse,
    single: async () => noopResponse,
    eq: () => builder,
    order: () => builder,
    then: (resolve: any) => Promise.resolve(noopResponse).then(resolve),
    catch: (catcher: any) => Promise.resolve(noopResponse).catch(catcher),
  };
  return builder;
};

const createClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ data: null, error: null }),
  },
  from: () => createNoopQueryBuilder(),
});

export { createClient };
export default { createClient };