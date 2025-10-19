import { Component } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';
import { Box } from '@components/common/box/box';
import { IconButton } from '@components/common/icon-button/icon-button';
import { Textarea } from '@components/common/textarea/textarea';

@Component({
  selector: 'app-home',
  imports: [Card, Container, Box, IconButton, Textarea],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
