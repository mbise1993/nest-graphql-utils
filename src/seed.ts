import { createConnection } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { createConnectionOptions } from './database.config';
import { UserEntity } from 'src/identity/entities/user.entity';
import { AddressEntity } from 'src/common/entities/address.entity';
import { BandEntity } from 'src/band/entities/band.entity';
import { ChatEntity } from 'src/chat/entities/chat.entity';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { MemberProfileEntity } from 'src/identity/entities/memberProfile.entity';
import { CalendarEntity } from 'src/calendar/entities/calendar.entity';
import { EventTagEntity } from 'src/calendar/entities/eventTag.entity';
import { EventEntity } from 'src/calendar/entities/event.entity';
import { FolderEntity } from 'src/files/entities/folder.entity';

// *** USERS ***
const admin = new UserEntity();
admin.isAdmin = true;
admin.firstName = 'App';
admin.lastName = 'Admin';
admin.email = 'app.admin@bandspace.com';
admin.password = bcryptjs.hashSync('password1', 10);

const user1 = new UserEntity();
user1.firstName = 'Matt';
user1.lastName = 'Bise';
user1.email = 'matt.bise@bandspace.com';
user1.password = bcryptjs.hashSync('password1', 10);
user1.address = new AddressEntity();
user1.address.street = '1600 Royal Crest Dr';
user1.address.unit = '#213';
user1.address.city = 'Austin';
user1.address.state = 'TX';
user1.address.zipCode = 78741;
user1.address.country = 'USA';

const user2 = new UserEntity();
user2.firstName = 'John';
user2.lastName = 'Doe';
user2.email = 'john.doe@bandspace.com';
user2.password = bcryptjs.hashSync('password1', 10);

const user3 = new UserEntity();
user3.firstName = 'Lucy';
user3.lastName = 'Fur';
user3.email = 'lucy.fur@bandspace.com';
user3.password = bcryptjs.hashSync('password1', 10);

// *** BANDS ***
const band1 = new BandEntity();
band1.name = 'Halfway Atlantic';
band1.email = 'halfway.atlantic@bandpsace.com';
band1.city = 'Austin';
band1.state = 'TX';
band1.facebook = 'https://www.facebook.com/halfwayatlantic/';
band1.chat = new ChatEntity();
band1.calendar = new CalendarEntity();
band1.rootFolder = new FolderEntity();
band1.rootFolder.name = 'root';

const member1 = new MemberProfileEntity();
member1.isAdmin = true;
member1.role = 'Guitarist';
member1.band = band1;
member1.user = user1;

const member2 = new MemberProfileEntity();
member2.role = 'Vocalist';
member2.band = band1;
member2.user = user2;

const member3 = new MemberProfileEntity();
member3.role = 'Drummer';
member3.band = band1;
member3.user = user3;

// *** CHAT ***
const createMessage = (text: string, member: MemberProfileEntity) => {
  const message = new MessageEntity();
  message.text = text;
  message.member = member;
  return message;
};

const generalChannel = new ChannelEntity();
generalChannel.name = 'General';
generalChannel.description = 'General discussion';
generalChannel.messages = [
  createMessage('Yo', member1),
  createMessage('Lmao', member2),
];
generalChannel.chat = band1.chat;

const demosChannel = new ChannelEntity();
demosChannel.name = 'Demos';
demosChannel.description = 'Song demos and ideas';
demosChannel.messages = [
  createMessage('Peep this', member1),
  createMessage('Fuck u Kyle', member2),
  createMessage('Yeet', member3),
];
demosChannel.chat = band1.chat;

// *** CALENDAR ***
const practiceTag = new EventTagEntity();
practiceTag.name = 'Practice';
practiceTag.color = '#2988EE';
practiceTag.calendar = band1.calendar;

const showTag = new EventTagEntity();
showTag.name = 'Show';
showTag.color = '#29EE2C';
showTag.calendar = band1.calendar;

const practice1 = new EventEntity();
practice1.name = 'Practice';
practice1.startAt = new Date('2020-03-15T14:00:00.000Z');
practice1.endAt = new Date('2020-03-15T18:00:00.000Z');
practice1.createdBy = member1;
practice1.updatedBy = member1;
practice1.tags = [practiceTag];
practice1.calendar = band1.calendar;

const show1 = new EventEntity();
show1.name = 'Show @ CATI';
show1.startAt = new Date('2020-04-15T18:00:00.000Z');
show1.endAt = new Date('2020-04-15T22:00:00.000Z');
show1.createdBy = member2;
show1.updatedBy = member3;
show1.tags = [showTag];
show1.calendar = band1.calendar;

const seed = async () => {
  const connection = await createConnection(createConnectionOptions());
  connection.transaction(async entityManager => {
    await entityManager.save([admin, user1, user2, user3]);
    await entityManager.save([band1]);
    await entityManager.save([member1, member2, member3]);
    await entityManager.save([generalChannel, demosChannel]);
  });
};

seed();
