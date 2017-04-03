import { PlayerTC } from './models/Player';
import { TournamentTC } from './models/Tournament';
// MULTI SCHEMA MODE IN ONE SERVER
// create new GQC from ComposeStorage
import { ComposeStorage } from 'graphql-compose';
import composeWithRelay from 'graphql-compose-relay';

const GQC = new ComposeStorage();
const RootQueryTC = GQC.rootQuery();
composeWithRelay(RootQueryTC);

const ViewerTC = GQC.get('Viewer');
GQC.rootQuery().addFields({
  viewer: {
    type: ViewerTC.getType(),
    description: 'Data under client context',
    resolve: () => ({}),
  },
});

// create GraphQL Schema with all available resolvers for User Type
const fields = {
  playerById: PlayerTC.getResolver('findById'),
  playerByIds: PlayerTC.getResolver('findByIds'),
  playerOne: PlayerTC.getResolver('findOne'),
  playerMany: PlayerTC.getResolver('findMany'),
  playerTotal: PlayerTC.getResolver('count'),
  playerConnection: PlayerTC.getResolver('connection'),

  tournamentById: TournamentTC.getResolver('findById'),
  tournamentByIds: TournamentTC.getResolver('findByIds'),
  tournamentOne: TournamentTC.getResolver('findOne'),
  tournamentMany: TournamentTC.getResolver('findMany'),
  tournamentTotal: TournamentTC.getResolver('count'),
  tournamentConnection: TournamentTC.getResolver('connection'),
};

ViewerTC.addFields(fields);

GQC.rootMutation().addFields({
  playerCreate: PlayerTC.getResolver('createOne'),
  playerUpdateById: PlayerTC.getResolver('updateById'),
  playerUpdateOne: PlayerTC.getResolver('updateOne'),
  playerUpdateMany: PlayerTC.getResolver('updateMany'),
  playerRemoveById: PlayerTC.getResolver('removeById'),
  playerRemoveOne: PlayerTC.getResolver('removeOne'),
  playerRemoveMany: PlayerTC.getResolver('removeMany'),

  tournamentCreate: TournamentTC.getResolver('createOne'),
  tournamentUpdateById: TournamentTC.getResolver('updateById'),
  tournamentUpdateOne: TournamentTC.getResolver('updateOne'),
  tournamentUpdateMany: TournamentTC.getResolver('updateMany'),
  tournamentRemoveById: TournamentTC.getResolver('removeById'),
  tournamentRemoveOne: TournamentTC.getResolver('removeOne'),
  tournamentRemoveMany: TournamentTC.getResolver('removeMany'),

});

const graphqlSchema = GQC.buildSchema();

export default graphqlSchema;
